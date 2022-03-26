import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import fastify from 'fastify';
import { typeDefs } from './typeDefs.mjs';
import { resolvers } from './resolvers.mjs';
import 'dotenv/config'

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
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [
            fastifyAppClosePlugin(app),
            ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
        ],
    });

    await server.start();
    app.register(server.createHandler());
    await app.listen(4000);
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

await startApolloServer(typeDefs, resolvers);