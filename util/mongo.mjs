import config from '../config.mjs'
import logger from './logger.mjs'
import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(config.MONGO_CONFIG.DB_URL, {
  useUnifiedTopology: true
});

let db = null

export default {
  connect: async () => {
    try {
      await client.connect()
      db = client.db(config.MONGO_CONFIG.DB_NAME)
      logger.trace('mongodb connect successful')
    } catch(err) {
      logger.error('mongodb connect err ' + err)
    }
  },
  getDB: () => db,
  ObjectId
}

