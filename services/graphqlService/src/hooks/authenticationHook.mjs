export default () => (request, reply, done) => {
    const path = request.urlData('path')

    // No auth endpoints
    if (path === '/healthcheck' || path === '/graphql') {
        done()
        return
    }

    // Internal endpoints
    if (path.startsWith('/internal/')) {
        // Check that the app secret is present
        const appSecret = process.env.INTERNAL_TOKEN
        if (!appSecret) { reply.code(401).send(new Error('Unauthorized')); done(); return; }

        // Check that the request secret matches the given secret
        const secret = request?.headers?.authorization
        if (secret !== appSecret) { reply.code(401).send(new Error('Unauthorized')); done(); return; }

        done()
        return
    }
}
