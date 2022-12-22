import Router from '@koa/router'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import logger from '../util/logger.mjs'
import sequelize from '../util/sequelize.mjs'
import {API_URL, SIGIN_IN_EXPIRE } from '../config.mjs'
import redis from '../util/redis.mjs'
const client = redis.client
// 创建路由
const router = new Router({
  prefix: API_URL + '/user'
})

// 注册
router.post('/sign-up', async (ctx) => {
  const { username, password } = ctx.request.body
  let sql = `select * from user where username=:username`
  try {
    let result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { username }
    })
    if (result.length > 0) {
      ctx.response.body = { desc: '用户已存在' }
      ctx.response.status = 406
      return
    }

    // 密码加密 (这里使用salt加密 理由：https://zhuanlan.zhihu.com/p/265663631)
    // 创建salt
    const salt = crypto.randomBytes(8).toString('hex')
    // 加密
    const passwordSalted = crypto
      .createHmac('sha256', salt)
      .update(password)
      .digest('hex')
    logger.info(salt.length)
    // 插入数据库 
    sql = `insert user set username=:username, password=:password, salt=:salt`
    result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.INSERT,
      replacements: {
        ...ctx.request.body,
        password: passwordSalted,
        salt
      }
    })
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 登录
router.post('/sign-in', async (ctx) => {
  const { username, password } = ctx.request.body
  let sql = `select * from user where username=:username`
  try {
    const result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { username }
    })
    if (result.length <= 0) {
      ctx.response.body = { desc: '用户不存在' }
      ctx.response.status = 406
      return
    }
    // 校验密码
    const passwordSalted = crypto
      .createHmac('sha256', result[0].salt)
      .update(password)
      .digest('hex')
    if (passwordSalted !== result[0].password) {
      ctx.response.body = { desc: '密码错误' }
      ctx.response.status = 406
      return
    }
    const user = {
      username: result[0].username,
      id: result[0].id
    }
    // 生成 token (这里使用 jwt)
    const token = jwt.sign(user, 'node_demo')
    await client.set(`token:${token.split(' ')[1]}`, JSON.stringify(user))
    SIGIN_IN_EXPIRE &&
      await client.expire(`token:${token.split(' ')[1]}`, SIGIN_IN_EXPIRE)
    ctx.response.body = {
      result: {
        _t: token
      },
      desc: ''
    }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

export default router