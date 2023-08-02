const { Option, Command } = require('clipanion')
const inquirer = require('inquirer')
const BaseCommand = require('./command')

const bundlePackages = [
  {
    name: '@monitorjs/browser',
    version: '1.0.0',
    path: 'packages/browser',
    private: false,
    location: 'packages/browser',
  },
  {
    name: '@monitorjs/core',
    version: '1.0.0',
    path: 'packages/core',
    private: false,
    location: 'packages/core',
  },
]

const question = {
  type: 'list',
  name: 'Choose a package to build',
  choices: bundlePackages,
  prefix: '🛠',
}

class BuildCommand extends BaseCommand {
  static paths = [['build']]

  package = Option.String(`-p,--project`)

  all = Option.Boolean(`-a,--all`, false)

  async execute() {
    if (this.package && !bundlePackages.includes(this.package)) {
      throw new TypeError(`please input right package name.`)
    }

    await this.prompt()
  }

  async prompt() {
    if (this.all) {
      await this.ts()
      await this.rollup()
      return
    }

    if (this.package) {
      return this.run(this.package)
    }

    const answer = await inquirer.prompt([question])
    await this.run(answer[question.name])
  }

  async run(pkg) {
    await this.ts(pkg)
    // await this.rollup(pkg)
  }

  async ts(pkg) {
    await this.execAsync('tsc -b ./tsconfigs/tsconfig.lib.json')
  }
}

module.exports = BuildCommand
