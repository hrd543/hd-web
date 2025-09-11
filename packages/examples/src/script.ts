import { spawnSync } from 'child_process'

const [method, folder] = process.argv.slice(2)

const run = async () => {
  if (!folder || !method) {
    console.error('must provide a method and folder')

    return
  }

  process.chdir(`src/${folder}`)
  spawnSync('npm run hd', [method])
}

run()
