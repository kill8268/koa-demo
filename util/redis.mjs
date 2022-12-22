import redis from 'redis'
import config from '../config.mjs' 
import logger from './logger.mjs'

const client = redis.createClient(config.REDIS_CONFIG);
client.on("error", (error) => logger.error('[redis]', error)); 

export default {
  connect: async() => {
    try {
      logger.trace('redis in connection')
      await client.connect()
      logger.trace('redis connect successful')
    } catch(err) {
      logger.error('redis connect err ' + err)
    }
  },
  client: client,
}