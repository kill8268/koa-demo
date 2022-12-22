import Router from '@koa/router'
import logger from '../util/logger.mjs'
import { API_URL } from '../config.mjs'
import mongo from '../util/mongo.mjs'

// 创建路由
const router = new Router({
  prefix: API_URL + '/mongo'
})

// 列表查询
router.get('/', async (ctx) => {
  try {
    const result = await mongo.getDB().collection('test_data')
      .find().toArray()
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 主键查询
router.get('/:_id', async (ctx) => {
  try {
    const result = await mongo.getDB().collection('test_data')
      .find({_id: mongo.ObjectId(ctx.params._id)}).toObject()
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 根据主键删除
router.delete('/:_id', async (ctx) => {
  try {
    const result = await mongo.getDB().collection('test_data')
      .deleteOne({ _id: mongo.ObjectId(ctx.params._id)})
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 根据主键更新
router.put('/:_id', async (ctx) => {
  try {
    const result = await mongo.getDB().collection('test_data')
      .updateOne({ _id: mongo.ObjectId(ctx.params._id)}, { $set: ctx.request.body })
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
    const result = await mongo.getDB().collection('test_data')
      .insertOne(ctx.request.body)
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

export default router