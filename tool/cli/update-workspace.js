const { existsSync } = require('fs')
const { relative } = require('path')
const { exec } = require('../utils/subprocess')
const { pathToRoot, rootPath } = require('../utils/path')
const { prettier, writeFileAsync } = require('../utils/fs')

const BaseCommand = require('./command')
const workspaceDefFile = pathToRoot('tool', 'utils', 'workspace.generated.js')

class UpdateWorkspaceCommand extends BaseCommand {
  static paths = [['update-workspace']]

  async execute() {
    const list = JSON.parse(exec('', 'pnpm recursive ls --json --depth 0', { silent: true }))

    list.forEach((p) => {
      p.location = relative(rootPath, p.path).replace(/\\/g, '/')
    })
    await this.generateWorkspaceConsts(list)
    // await this.generateTsConfigs()

    await this.generateRollupConfig(list)
  }

  async generateWorkspaceConsts(packageList) {
    let content = '// Auto generated content by `pnpm cli update-workspace`\n// DO NOT MODIFY THIS FILE MANUALLY\n'
    content += `const packageList = ${JSON.stringify(packageList, null, 2)} \n\n`
    content += 'module.exports.default = packageList'

    await writeFileAsync(workspaceDefFile, prettier(content))
  }

  async generateRollupConfig(packageList) {
    packageList.forEach(({ name, path }) => {
      if (name.startsWith('@monitorjs')) {
        console.log(name, path)
      }
    })
  }

  async generateTsConfigs() {
    const pathsConfigFile = pathToRoot('tsconfigs', 'tsconfig.paths.json')
    const libConfigFile = pathToRoot('tsconfigs', 'tsconfig.lib.json')
    const projectConfigFile = pathToRoot('tsconfigs', 'tsconfig.project.json')
    const filteredPackages = packages.filter((p) => !p.name.startsWith('@example'))
    const pathsConfig = {
      compilerOptions: {
        baseUrl: './',
        paths: filteredPackages.reduce((paths, pkg) => {
          const pkgRelativePath = relative(rootPath, pkg.srcPath).replace(/\\/g, '/')
          paths[pkg.name] = [pkgRelativePath]
          paths[`${pkg.name}/*`] = [pkgRelativePath + '/*']
          return paths
        }, {}),
      },
    }

    const projectConfig = {
      compilerOptions: {
        noEmit: true,
      },
      include: [],
      references: filteredPackages
        .filter((p) => existsSync(p.relative('tsconfig.json')))
        .map((p) => ({ path: `../${p.relativePath}` }))
        .concat(
          {
            path: '../examples',
          },
          {
            path: '../tools',
          },
        ),
    }

    const libConfig = {
      compilerOptions: {
        noEmit: true,
      },
      include: [],
      references: filteredPackages
        .filter((p) => !p.packageJson.private && existsSync(p.relative('tsconfig.json')))
        .map((p) => ({ path: `../${p.relativePath}` })),
    }

    await writeFileAsync(pathsConfigFile, '// AUTO GENERATED\n' + prettier(JSON.stringify(pathsConfig), 'json'))
    await writeFileAsync(projectConfigFile, '// AUTO GENERATED\n' + prettier(JSON.stringify(projectConfig), 'json'))
    await writeFileAsync(libConfigFile, '// AUTO GENERATED\n' + prettier(JSON.stringify(libConfig), 'json'))
  }
}

module.exports = UpdateWorkspaceCommand
