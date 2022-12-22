import Router from '@koa/router'
import redis from '../util/redis.mjs'
import logger from '../util/logger.mjs'
import { API_URL } from '../config.mjs'

const client = redis.client

// 创建路由
const router = new Router({
  prefix: API_URL + '/redis'
})

// 列表查询
router.get('/', async (ctx) => {
  try {
    const result = await client.HGETALL('test_data')
    ctx.response.body = {
      result: Object.keys(result).map(key => JSON.parse(result[key])),
      desc: ''
    }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 主键查询
router.get('/:id', async (ctx) => {
  try {
    const result = JSON.parse(await client.HGET('test_data', ctx.params.id))
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 根据主键删除
router.delete('/:id', async (ctx) => {
  try {
    const result = await client.HDEL('test_data', ctx.params.id)
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 根据主键更新
router.put('/:id', async (ctx) => {
  try {
    const result = await client.HSET('test_data',
      ctx.params.id, JSON.stringify({
        ...ctx.request.body,
        ...ctx.params
      }))
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 新增
router.post('/', async (ctx) => {
  try {
    const result = await client.HSET('test_data',
      ctx.request.body.id, JSON.stringify(ctx.request.body))
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

export default router