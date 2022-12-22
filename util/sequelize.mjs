import Sequelize from 'sequelize'
import { MYSQL_CONFIG } from '../config.mjs'

const sequelize = new Sequelize(
  MYSQL_CONFIG.DATABASE,
  MYSQL_CONFIG.USER,
  MYSQL_CONFIG.PASSWORD,
  {
    dialect: MYSQL_CONFIG.DIALECT,
    host: MYSQL_CONFIG.HOST,
    pool: {
      min: MYSQL_CONFIG.POOL.MIN,
      max: MYSQL_CONFIG.POOL.MAX
    },
    logging: MYSQL_CONFIG.LOGGING
  }
)

export default sequelize