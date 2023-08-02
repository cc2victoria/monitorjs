const chalk = require('chalk')
const newLineSeparator = /\r\n|[\n\v\f\r\x85\u2028\u2029]/g

class Logger {
  log = this.getLineLogger(console.log.bind(console), chalk.gray)
  info = this.getLineLogger(console.info.bind(console), chalk.blue)
  warn = this.getLineLogger(console.warn.bind(console), chalk.bgHex('#322b08').hex('#fadea6'))
  error = this.getLineLogger(console.error.bind(console), chalk.bgHex('#250201').hex('#ef8784'))
  success = this.getLineLogger(console.log.bind(console), chalk.green)

  constructor(tag) {}

  getLineLogger(logLine, color) {
    return (...args) => {
      args.forEach((arg) => {
        arg
          .toString()
          .split(newLineSeparator)
          .forEach((line) => {
            if (line.length !== 0) {
              if (this.tag) {
                logLine(color(`[${this.tag}] ${line}`))
              } else {
                logLine(color(line))
              }
            }
          })
      })
    }
  }
}

const logger = new Logger()

module.exports = {
  Logger,
  logger,
}

module.exports.default = Logger
