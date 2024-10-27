import { NextFunction, Request, Response } from 'express'
import config from '../config'

enum LOG_LEVEL {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  PANIC,
} // I HATE TS ENUMS

const strFromLogLevel = (level: LOG_LEVEL): string => {
  switch (level) {
    case LOG_LEVEL.DEBUG:
      return 'DEBUG'
    case LOG_LEVEL.INFO:
      return 'INFO'
    case LOG_LEVEL.WARN:
      return 'WARN'
    case LOG_LEVEL.ERROR:
      return 'ERROR'
    case LOG_LEVEL.PANIC:
      return 'PANIC'
    default:
      return 'UNKNOWN'
  }
}

type Log = {
  level: LOG_LEVEL
  cause: string
  message: string
  timestamp: Date
}

type IOLogAction = void
type LogWriter = (logs: Log[]) => IOLogAction

const initLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  req.body.logs = []
  next()
}

/**
 * mkStringFromLog takes a log object and returns a nicely formatted string
 * representation of it.
 *
 * The output string is a single line, with the following format:
 *
 * [LEVEL]: at [TIMESTAMP]:
 * [CAUSE]
 * [MESSAGE]
 *
 * Where:
 *
 *   LEVEL is the string representation of log.level
 *   TIMESTAMP is the log.timestamp in the current locale
 *   CAUSE is the log.cause
 *   MESSAGE is the log.message
 *
 * The entire string is prefixed and suffixed with 50 dashes, to make it
 * stand out when printed.
 *
 * @param {Log} log - a Log object
 * @returns {string} a string representation of the log
 */
const mkStringFromLog = (log: Log): string =>
  ''
    .concat('--------------------------------------------\n')
    .concat(`  [${strFromLogLevel(log.level)}]: `)
    .concat(`  at [${log.timestamp.toLocaleString()}]:\n`)
    .concat(`    [${log.cause}]:\n`)
    .concat(`      ${log.message}`)
    .concat('--------------------------------------------\n')

/**
 * concatLog takes an array of logs and a new log, and returns
 * a new array of logs that is the concatenation of the original
 * logs and the new log.
 *
 * @param {Log[]} logs - the original array of logs
 * @param {Log} log - the new log to be added
 * @returns {Log[]} - the new array of logs
 */
const concatLog = (logs: Log[], log: Log): Log[] => [...logs, log]

/**
 * mkLogger creates a logger function that takes a cause and a message,
 * and returns a Log object with the given level.
 *
 * @param {LOG_LEVEL} level - the log level of the logger
 * @returns {(cause: string) => (message: string) => Log} - a logger function
 */
const mkLogger =
  (level: LOG_LEVEL) =>
  (cause: string) =>
  (message: string): Log => {
    return {
      level,
      cause,
      message,
      timestamp: new Date(),
    }
  }

/**
 * mkLogWriter creates a LogWriter that filters logs that are greater than or
 * equal to the given printLevel, and then logs the formatted logs to the
 * console.
 *
 * @param {LOG_LEVEL} printLevel - The minimum level of logs to be printed.
 * @returns {LogWriter} A LogWriter that logs to the console.
 */
const mkLogWriter = (printLevel: LOG_LEVEL): LogWriter => {
  return (logs: Log[]): IOLogAction => {
    console.log('\n---LOGS START---: ' + logs.length)
    logs
      .filter((log) => log.level >= printLevel)
      .map(mkStringFromLog)
      .forEach(console.log)
    console.log('---DNE SGOL---\n')
  }
}

const logLevel = config.logger.level
  ? parseInt(config.logger.level)
  : LOG_LEVEL.DEBUG
const logWriter: LogWriter = mkLogWriter(LOG_LEVEL.DEBUG)

const debugLogger = mkLogger(LOG_LEVEL.DEBUG)
const infoLogger = mkLogger(LOG_LEVEL.INFO)
const warnLogger = mkLogger(LOG_LEVEL.WARN)
const errorLogger = mkLogger(LOG_LEVEL.ERROR)
const panicLogger = mkLogger(LOG_LEVEL.PANIC)

export {
  initLogs,
  mkLogger,
  mkLogWriter,
  mkStringFromLog,
  concatLog,
  logWriter,
  LOG_LEVEL,
  LogWriter,
  debugLogger,
  infoLogger,
  warnLogger,
  errorLogger,
  panicLogger,
}
