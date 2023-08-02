const { Cli } = require('clipanion')
const BuildCommand = require('./cli/build')
const UpdateWorkspaceCommand = require('./cli/update-workspace')

const cli = new Cli()
cli.register(UpdateWorkspaceCommand)
cli.register(BuildCommand)
cli.runExit(process.argv.slice(2), Cli.defaultContext)
