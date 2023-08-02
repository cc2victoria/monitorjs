const path = require('path')
const fs = require('fs')
const { format } = require('prettier')
const { packageJsonPath } = require('./path')

console.log(packageJsonPath)
const { prettier: prettierConfig } = require(packageJsonPath)

const readdir = fs.promises.readdir
const writeFileAsync = fs.promises.writeFile
const exists = fs.existsSync

function isFile(file) {
  return fs.existsSync(file) && fs.statSync(file).isFile()
}

function isDirectory(dir) {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory()
}

async function visitRecursively(fileOrFolder, visitor, options) {
  if (isDirectory(fileOrFolder)) {
    const children = await readdir(fileOrFolder)
    await Promise.all(children.map((child) => visitRecursively(path.join(fileOrFolder, child), visitor, options)))
  } else if (isFile(fileOrFolder)) {
    const shouldVisit = !options.filter || options.filter(fileOrFolder)
    if (!shouldVisit) {
      return
    }

    return visitor(fileOrFolder) || Promise.resolve()
  } else {
    throw new Error(`path ${fileOrFolder} does not exist!`)
  }
}

async function getFileContent(file) {
  return promises.readFile(file, { encoding: 'utf8' })
}

function prettier(content, parser = 'typescript') {
  return format(content, { ...prettierConfig, parser })
}

module.exports = {
  readdir,
  writeFileAsync,
  exists,
  isFile,
  isDirectory,
  visitRecursively,
  getFileContent,
  prettier,
}
