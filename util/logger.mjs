import log4js from 'log4js'
import config from '../config.mjs'

const {NAME, LOG} = config

// log4js.configure({
//   appenders: {
//     console: { type: 'console' },
//     file: { type: 'file', filename: `${LOG.PATH}/server.log` }
//   },
// })

const logger = log4js.getLogger(NAME);

logger.level = LOG.LEVEL;


export default logger;