import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer, AuthenticationError } from 'apollo-server-core';
import fastify from 'fastify';
import FastifyCookie from 'fastify-cookie'
import FastifyUrlData from 'fastify-url-data'
import FastifyCors from 'fastify-cors'
import { typeDefs } from './typeDefs.mjs';
import { resolvers } from './resolvers.mjs';
import 'dotenv/config'
import { getUser, refreshIfNeeded } from './utils/authentication.mjs';
import { ACCESS_TOKEN_NAME as ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME as REFRESH_TOKEN_NAME } from './constants.mjs';
import authenticationHook from './hooks/authenticationHook.mjs';
import routes from './routes/routes.mjs'

/**
 * 
 * @param {FastifyInstance} app 
 * @returns ApolloServerPlugin
 */
function fastifyAppClosePlugin(app) {
    return {
        async serverWillStart() {
            return {
                async drainServer() {
                    await app.close();
                },
            };
        },
    };
}

async function startApolloServer(typeDefs, resolvers) {
    const app = fastify();

    // Add support for cookies
    app.register(FastifyCookie, {
        secret: process.env.COOKIE_SECRET, // for cookies signature
        parseOptions: {}     // options for parsing cookies
    })

    // Add support for parsing the URL and the parameters separately
    app.register(FastifyUrlData)

    // Add authentication handler (for REST calls)
    app.addHook('preHandler', authenticationHook())

    // Add routes
    app.register(routes)

    // Add GraphQL support
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ request, reply }) => {
            // To find out the correct arguments for a specific integration,
            // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

            let token = null
            let refreshToken = null

            // Try cookie authentication first
            try {
                // Parse cookies
                token = request.cookies[ACCESS_TOKEN_NAME]
                refreshToken = request.cookies[REFRESH_TOKEN_NAME]

                if (!!process.env.COOKIE_SECRET && token) {
                    token = request.unsignCookie(token);
                    token = token?.valid ? token.value : null;
                }
                if (!!process.env.COOKIE_SECRET && refreshToken) {
                    refreshToken = request.unsignCookie(refreshToken);
                    refreshToken = refreshToken?.valid ? refreshToken.value : null;
                }

                // Check if token needs a refresh
                if (token && refreshToken) {
                    ({ token, refreshToken } = await refreshIfNeeded(reply, token, refreshToken));
                }
            }
            catch (ex) {
                console.error(ex)
            }

            // Then try with authorization headers if cookie wasn't being used
            try {
                token = token ? token : (request.headers[ACCESS_TOKEN_NAME.toLowerCase()]?.slice(7) || '');
                refreshToken = refreshToken ? refreshToken : (request.headers[REFRESH_TOKEN_NAME.toLowerCase()]?.slice(7) || '');
            }
            catch (ex) {
                console.error(ex)
            }

            // Try to retrieve a user with the token
            const user = getUser(token);

            // Add the token and user to the context
            return { request, reply, token, refreshToken, user };
        },
        formatError: (err) => {
            // if (err.originalError instanceof AuthenticationError) {
            //     return new Error('Unauthenticated');
            // }

            // Otherwise return the original error. The error can also
            // be manipulated in other ways, as long as it's returned.
            return err;
        },
        plugins: [
            fastifyAppClosePlugin(app),
            ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
        ],
    });

    await server.start();
    app.register(server.createHandler({
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(','),
            credentials: true,
        }
    }));
    await app.listen(4000, '0.0.0.0');
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

await startApolloServer(typeDefs, resolvers);