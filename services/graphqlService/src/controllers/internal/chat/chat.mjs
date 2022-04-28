import Chat from "../../../logic/chat.mjs"

export default (request, reply) => {
    let data = {}
    if (request.routerMethod === 'GET') {
        data = request.query
    }
    else if (request.routerMethod === 'POST') {
        data = request.body
    }

    const chat = new Chat()
    chat.newChatMessage(data)
        .then(r => {
            reply.code(200).send('OK')
        })
        .catch(err => {
            console.error(err)
            reply.code(400).send(err)
        })
}
