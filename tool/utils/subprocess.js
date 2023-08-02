const { execSync, spawn: RawSpawn, ChildProcess } = require('child_process')
const { performance } = require('perf_hooks')
const { Logger } = require('./log')

const children = new Set()

function spawn(tag, cmd, options) {
  cmd = typeof cmd === 'string' ? cmd.split(' ') : cmd
  const isYarnSpawn = cmd[0] === 'yarn'

  const spawnOptions = {
    stdio: isYarnSpawn ? ['inherit', 'inherit', 'inherit'] : ['inherit', 'pipe', 'pipe'],
    shell: true,
    ...options,
    env: { ...process.env, ...(options && options.env ? options.env : {}) },
  }

  const logger = new Logger(isYarnSpawn ? '' : tag)
  !isYarnSpawn && logger.info(cmd.join(' '))
  const childProcess = RawSpawn(cmd[0], cmd.slice(1), spawnOptions)
  children.add(childProcess)

  const drain = (_code, signal) => {
    children.delete(childProcess)

    // don't run repeatedly if this is the error event
    if (signal === undefined) {
      childProcess.removeListener('exit', drain)
    }
  }

  childProcess.stdout.on('data', (chunk) => {
    logger.log(chunk)
  })

  childProcess.stderr.on('data', (chunk) => {
    logger.error(chunk)
  })

  childProcess.once('error', (e) => {
    logger.error(e.toString())
    children.delete(childProcess)
  })

  childProcess.once('exit', (code, signal) => {
    if (code !== 0) {
      logger.error('Finished with non-zero exit code.')
    }

    drain(code, signal)
  })

  return childProcess
}

function execAsync(tag, cmd, options) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(tag, cmd, options)

    childProcess.once('error', (e) => {
      reject(e)
    })

    childProcess.once('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Child process exits with non-zero code ${code}`))
      }
    })
  })
}

function exec(tag, cmd, { silent } = { silent: false }) {
  const logger = new Logger(tag)
  !silent && logger.info(cmd)
  const result = execSync(cmd, { encoding: 'utf8' }).trim()
  !silent && logger.log(result)
  return result
}

async function runParallel(names, run, options = { concurrency: 3 }) {
  const runningPackages = new Set()
  const returnedValues = []
  const thrownErrors = []
  return new Promise((resolve, reject) => {
    const runNextPackage = () => {
      const name = names.shift()
      if (name) {
        runningPackages.add(name)
        void run(name)
          .then((value) => {
            returnedValues.push(value)
            runNextPackage()
          })
          .catch((err) => {
            if (options.noBail) {
              thrownErrors.push(err)
            } else {
              reject(err)
            }
          })
          .finally(() => {
            runningPackages.delete(name)
            if (runningPackages.size === 0) {
              if (thrownErrors.length) {
                reject(thrownErrors)
              } else {
                resolve(returnedValues)
              }
            }
          })
      }
    }

    while (options.concurrency--) {
      runNextPackage()
    }
  })
}

async function dispatchParallelJobs(scriptName, job, packagesToRun = [], concurrency = 3) {
  const logger = new Logger(scriptName)
  const run = async (packageName) => {
    const startTime = performance.now()
    logger.info(`Start running ${scriptName} in [${packageName}] package`)
    await job(packageName)
    logger.success(`[${packageName}] ✨ Done in ${((performance.now() - startTime) / 1000).toFixed(2)}s`)
  }

  try {
    await runParallel(packagesToRun, run, { concurrency, noBail: true })
  } catch (e) {
    process.exit((e && e.code) || 1)
  }
}

module.exports = {
  spawn,
  execAsync,
  exec,
  runParallel,
  dispatchParallelJobs,
}
