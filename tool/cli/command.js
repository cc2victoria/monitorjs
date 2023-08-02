const { Command } = require('clipanion')
const { exec, execAsync, spawn } = require('../utils/subprocess')
const Logger = require('../utils/log')

class BaseCommand extends Command {
  get command() {
    return this.path[0]
  }

  get logger() {
    return new Logger(this.command)
  }

  get spawn() {
    return spawn.bind(null, this.command)
  }

  get exec() {
    return exec.bind(null, this.command)
  }

  get execAsync() {
    return execAsync.bind(null, this.command)
  }
}

module.exports = BaseCommand
