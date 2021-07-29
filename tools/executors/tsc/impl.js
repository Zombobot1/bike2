const { exec } = require('child_process')
const { promisify } = require('util')
const path = require('path')

module.exports.default = async function tsc(options, context) {
  process.chdir(path.join(context.cwd, context.workspace.projects[context.projectName].root))

  try {
    const { stdout, stderr } = await promisify(exec)(`tsc -b`)

    console.log(stdout)
    console.error(stderr)

    return { success: stderr === '' }
  } catch (e) {
    // console.log('aaaa', e, path.join(context.cwd, context.workspace.projects[context.projectName].root))
    if (e.stderr) console.error(e.stderr)
    if (e.stdout) console.error(e.stdout)
  }

  return { success: false }
}
