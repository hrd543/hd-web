import { spawn } from 'child_process'

const [method, folder] = process.argv.slice(2)

// TODO fix this

const run = async () => {
  if (!folder || !method) {
    console.error('must provide a method and folder')

    return
  }

  spawn(`cd src/${folder} && hd ${method}`, {
    stdio: 'inherit',
    shell: true
  })
}

run()
