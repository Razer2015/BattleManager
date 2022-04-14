import Server from "../../../logic/server.mjs"

export default (request, reply) => {
    let data = {}
    if (request.routerMethod === 'GET') {
        data = request.query
    }
    else if (request.routerMethod === 'POST') {
        data = request.body
    }

    const server = new Server()
    server.serverBroadcast(data)
        .then(r => {
            reply.code(200).send('OK')
        })
        .catch(err => {
            console.error(err)
            reply.code(400).send(err)
        })
}
