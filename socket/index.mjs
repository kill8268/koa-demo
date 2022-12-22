import {Server} from 'socket.io'
import logger from '../util/logger.mjs'
import redis from '../util/redis.mjs'

const socketFun = (socket, io) => {
  logger.trace(`[socket]: is connection`)
  
  // 使用emit向客户端发送消息 (xxx可自定义)
  // socket.emit('xxx', {})
  // 使用emit向客户端群发消息 (xxx可自定义)
  // io.sockets.emit('user-online', userInfo.username)

  // 使用on监听客户端发送的消息 (xxx可自定义)
  socket.on('online', async data => {
    const user = await redis.client.get(`token:${data.split(' ')[1]}`)
    if (!user) {
      socket.disconnect()
      return
    }
    const userInfo = JSON.parse(user)
    await redis.client.set(`online-user:${userInfo.id}`, socket.id)
    await redis.client.set(`socket-id:${socket.id}`, user)
    logger.trace(`[socket]: user(${userInfo.id}) is online`)
    io.sockets.emit('user-online', userInfo.username)
  })

  // socket 断开连接事件
  socket.on('disconnect', async () => {
    const user = await redis.client.get(`socket-id:${socket.id}`)
    if (!user) return
    const userInfo = JSON.parse(user)
    // socket.emit('user-online', userInfo.username, {broadcast:true})
    await redis.client.del(`online-user:${userInfo.id}`, socket.id)
    await redis.client.del(`socket-id:${socket.id}`, user)
    logger.trace(`[socket]: user(${userInfo.id}) is disconnect`)
  })
}

export default (server) => {
  const io = Server(server, {
    cors: {
      origin: "*",
      allowedHeaders: ["*"],
      credentials: true,
    }
  })
  io.on('connection', async (socket) => socketFun(socket, io))
}