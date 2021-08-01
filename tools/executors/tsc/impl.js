const { exec } = require('child_process')
const { promisify } = require('util')
const path = require('path')
const { spawn } = require('child_process')

module.exports.default = async function tsc(options, context) {
  // process.chdir(path.join(context.cwd, context.workspace.projects[context.projectName].root))
  const p = path.join(context.cwd, context.workspace.projects[context.projectName].root)
  const ls = spawn(`node_modules/.bin/cypress`, ['run-ct', `--project ${p}`, '--config video=false'])

  return new Promise((res, rej) => {
    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      return rej({ success: false })
    })
  })

  // try {
  //   const { stdout, stderr } = await promisify(exec)(
  //     `node_modules/.bin/cypress --project ${p} run-ct --config video=false`,
  //   )

  //   console.log(stdout)
  //   console.error(stderr)

  //   console.log('wowowow 1')
  //   return { success: stderr === '' }
  // } catch (e) {
  //   try {
  //     console.log('wowowow')
  //     const { stdout, stderr } = await promisify(exec)(
  //       `\"../../node_modules/.bin/cypress\" run-ct --config video=false`,
  //     )

  //     console.log(stdout)
  //     console.error(stderr)

  //     return { success: stderr === '' }
  //   } catch (e) {
  //     if (e.stderr) console.error(e.stderr)
  //     if (e.stdout) console.error(e.stdout)
  //   }
  // }

  // return { success: false }
}
