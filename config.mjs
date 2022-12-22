import os from 'os'
// 服务端口
export const PORT = 9100
// 
export const NAME = 'node-demo'
// 服务名称
export const API_URL = '/api'
// 静态资源目录
export const STATIC_PATH = '../test-page/dist'
// 是否使用mongodb on or off
export const MONGO = 'off'
// 是否使用redis on or off 
export const REDIS = 'off'
// 是否使用socket on or off
export const SOCKET = 'off'
// 登录过期时间, 如果为空则不过期
export const SIGIN_IN_EXPIRE = 60 * 60 * 24 * 7
// 白名单
export const WHITE_LIST = [
  '/user/sign-in',
  '/user/sign-up',
]
// log4js 配置
export const LOG = {
  PATH: 'logs', // 日志目录
  LEVEL: 'all', // 日志级别
};
// mongodb 配置
export const MONGO_CONFIG = {
  DB_URL: 'mongodb://kill8268:Wangtengyu00@82.157.172.131:27017',
  // (mongodb://[username]:[password]@[ip]:[port])
  DB_NAME: 'node_demo', // mongodb 数据库名称
}
// mysql 配置
export const MYSQL_CONFIG = {
  DIALECT: 'mysql', // 数据库类型
  HOST: '1.15.239.28', // 数据库地址
  PORT: 3306, // 数据库端口
  DATABASE: 'node_demo', // 数据库名称
  USER: 'node_demo', // 数据库用户
  PASSWORD: 'wZYmpyF5NthZWwMm', // 数据库密码
  LOGGING: false, // 是否开启日志
  POOL: { // 数据库连接池配置 cpu核心数*2
    MIN: os.cpus().length, // 最小连接数
    MAX: os.cpus().length * 2 // 最大连接数
  },
}
// redis 配置
export const REDIS_CONFIG = {
  url: 'redis://82.157.172.131:6379', // redis 地址
  password: 'Wangtengyu00', // redis 密码
  database: 0 // redis 数据库
}
// 代理配置
export const PROXY_CONFIG = {
  '/xxx': { // 代理路径
    target: 'http://127.0.0.1:8000', // 代理地址
    pathRewrite: { '^/xxx': '' }, // 重写 url
    changeOrigin: true // 是否改变域名
  },
}

export default {
  PORT,
  NAME, 
  STATIC_PATH,
  API_URL,
  MONGO, 
  REDIS,
  SOCKET,
  SIGIN_IN_EXPIRE,
  WHITE_LIST,
  LOG,
  MONGO_CONFIG,
  MYSQL_CONFIG,
  REDIS_CONFIG,
  PROXY_CONFIG,
}