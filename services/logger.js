const { createLogger, format, transports, } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const moment = require("moment-timezone");

/**
 * Set format for logger
 */
const loggerFormat = format.combine(
  format.colorize({
    all: true,
  }),
  format.timestamp({
    format: 'YY-MM-DD HH:mm:ss',
  }),
  format.printf((info) => {
    if (info.stack) {
      return `[${[info.timestamp]}] [${info.level}] : ${info.message} : ${info.stack}`;
    }
    return `[${info.timestamp}] [${info.level}]: ${info.message}`;
  }),
);

module.exports = createLogger({
  level: 'info',
  format: format.json(),
  defaultMeta: {
    server: process.env.SERVER || "development",
    logType: 'simple'
  },
  transports: [
    //uncomment below DailyRotateFile to get logs in storage folder
    
    // new DailyRotateFile({
    //   filename: `storage/logs/error/%DATE%.log`,
    //   datePattern: 'YYYY-MM-DD',
    //   level: 'error',
    //   maxSize: '20m', // set the max size of each log file
    //   maxFiles: '30d',
    //   format: format.combine(
    //     format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    //     format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    //   )
    // }),
    // new DailyRotateFile({
    //   filename: `storage/logs/info/%DATE%.log`,
    //   datePattern: 'YYYY-MM-DD',
    //   level: 'info',
    //   maxSize: '20m', // set the max size of each log file
    //   maxFiles: '30d',
    //   format: format.combine(
    //     format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    //     format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    //   )
    // }),

    new transports.Console({
      format: format.combine(format.colorize(), loggerFormat),
    }),
    // new transports.File({
    //   filename: `storage/logs/error/${moment().format("MMM-DD-YYYY")}.log`,
    //   name: "file#error",
    //   level: "error",
    //   format: format.combine(
    //     format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    //     format.align(),
    //     format.printf(
    //       (info) => `${info.level}: ${[info.timestamp]}: ${info.stack}`
    //     )
    //   ),
    // }),
    // new transports.File({
    //   filename: `storage/logs/info/${moment().format("MMM-DD-YYYY")}.log`,
    //   name: "file#info",
    //   level: "info",
    //   format: format.combine(
    //     format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    //     format.align(),
    //     format.printf(
    //       (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
    //     )
    //   ),
    // }),
  ],
});
