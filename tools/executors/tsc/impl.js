const { exec } = require('child_process')
const { promisify } = require('util')
const path = require('path')

module.exports.default = async function tsc(options, context) {
  process.chdir(path.join(context.cwd, context.workspace.projects[context.projectName].root))

  try {
    const { stdout, stderr } = await promisify(exec)(`\"../../node_modules/.bin/cypress\" run-ct --config video=false`)

    console.log(stdout)
    console.error(stderr)

    return { success: stderr === '' }
  } catch (e) {
    if (e.stderr) console.error(e.stderr)
    if (e.stdout) console.error(e.stdout)
  }

  return { success: false }
}
