import fastifyPlugin from 'fastify-plugin'
import healthCheckController from '../controllers/healthcheck/get.mjs'
import serverBroadcastController from '../controllers/internal/server/broadcast.mjs'
import chatController from '../controllers/internal/chat/chat.mjs'

export default fastifyPlugin(async (fastify, opts, next) => {
    fastify.get('/healthcheck', healthCheckController)
    fastify.post('/internal/server/broadcast', serverBroadcastController)
    fastify.post('/internal/server/chat', chatController)
    next()
})
