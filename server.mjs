import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import config from './config.mjs'
import logger from './util/logger.mjs'
import proxy from 'koa-server-http-proxy'
import formidable from 'koa2-formidable'
import staticServer from 'koa-static'
import redis from './util/redis.mjs'
import mongo from './util/mongo.mjs'
import socket from './socket/index.mjs'
import routes from './routes/index.mjs'
import {createServer} from 'http'
import fs from 'fs'

// 创建koa实例
const app = new Koa();

app.env = 'production'

// 检查是否是api
const chack = (url) => {
  return !(url.includes(config.API_URL) ||
    !!Object.keys(config.PROXY)
      .find(key => url.includes(key)))
}

// history 中间件 避免history模式路由刷新404
app.use(async (ctx, next) => { 
  await next() // 等待请求执行完毕
  if (ctx.response.status === 404 && chack(ctx.request.url)) { // 判断是否符合条件
    ctx.type = 'text/html; charset=utf-8' // 修改响应类型
    ctx.body = fs.readFileSync(config.STATIC_PATH + '/index.html') // 修改响应体
  }
})

// 挂载前端静态文件
app.use(
  staticServer(config.STATIC_PATH, {
    maxage: 1000 * 60 * 60 * 24 * 7,
    gzip: true,
    hidden: true,
  }),
);

// 登录拦截 与 用户数据注入
app.use(async (ctx, next) => {
  if (config.WHITE_LIST
    .find(item => ctx.request.url
      .includes(config.API_URL + item)) || chack(ctx.request.url)) {
    await next()
  } else {
    if (!ctx.headers.authorization) {
      ctx.throw(401)
    } else {
      const token = ctx.headers.authorization.split(' ')[1]
      const user = await redis.client.get(`token:${token}`)
      if (!user) {
        ctx.throw(401)
      } else {
        ctx.user = JSON.parse(user)
        await next()
      }
    }
  }
})

// 挂载反向代理
Object.keys(config.PROXY_CONFIG)
  .forEach((context) =>
    app.use(proxy(context, config.PROXY_CONFIG[context])))

// 挂载 multipart/form-data 插件
app.use(formidable());

// 报文解析
app.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],
  jsonLimit: '50mb',
  queryString: {
    parameterLimit: 100000000000000
  },
}))

// 请求监听日志 
app.use(async (ctx, next) => {
  logger.trace(`--> ${ctx.request.method} ${ctx.request.url}`)
  await next();
  logger.trace(`<-- ${ctx.request.method} ${ctx.request.url} STATUS ${ctx.response.status}`)
});

const start = async () => {
  // 挂载 http 接口
  await routes(app)
  // 创建http服务
  const server = createServer(app.callback())
  config.SOCKET === 'on' && socket(server)
  config.MONGO === 'on' && await mongo.connect()
  config.REDIS === 'on' && await redis.connect()
  server.listen(config.PORT, () => logger.info(`服务监听端口:${config.PORT}`))
}

start()