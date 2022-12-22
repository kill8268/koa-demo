import Router from '@koa/router'
import logger from '../util/logger.mjs'
import { API_URL } from '../config.mjs'
import sequelize from '../util/sequelize.mjs'

// 创建路由
const router = new Router({
  prefix: API_URL + '/mysql'
})

// 列表查询
router.get('/', async (ctx) => {
  const sql = `select * from test_data`
  try {
    const result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    })
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 主键查询
router.get('/:id', async (ctx) => {
  const sql = `select * from test_data where id=:id`
  try {
    const result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      replacements: ctx.params
    })
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 根据主键删除
router.delete('/:id', async (ctx) => {
  const sql = `delete from test_data where id=:id`
  try {
    const result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.DELETE,
      replacements: ctx.params
    })
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 根据主键更新
router.put('/:id', async (ctx) => {
  const sql = `update test_data set title=:title, content=:content where id=:id`
  try {
    const result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.UPDATE,
      replacements: {
        ...ctx.params,
        ...ctx.request.body
      }
    })
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

// 新增
router.post('/', async (ctx) => {
  const sql = `insert into test_data (title, content) values (:title, :content)`
  try {
    const result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.UPDATE,
      replacements: ctx.request.body
    })
    ctx.response.body = { result, desc: '' }
  } catch (error) {
    logger.error('[api error]', error)
    ctx.response.body = { result: 'failed', desc: '500 Service Error' }
    ctx.response.status = 500
  }
})

export default router