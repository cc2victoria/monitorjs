const rootPath = process.cwd()
const { resolve, join, sep, parse } = require('path')

const pathToRoot = (...paths) => {
  return join(rootPath, ...paths)
}

const nodeModulesPath = pathToRoot('node_modules')
const packageJsonPath = pathToRoot('package.json')
const distPath = pathToRoot('dist')

const isRelativePath = (path) => {
  return path.startsWith('.' + sep) || path.startsWith('..' + sep)
}

module.exports = {
  rootPath,
  pathToRoot,
  distPath,
  nodeModulesPath,
  packageJsonPath,
  isRelativePath,
}
