#!/usr/bin/env node

import { spawnSync } from 'child_process'

const [method, folder] = process.argv.slice(2)

const run = () => {
  if (!folder) {
    console.error('must provide a folder')

    return
  }

  process.chdir(`src/${folder}`)
  spawnSync(`hd ${method}`)
}

run()
