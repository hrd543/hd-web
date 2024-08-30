#!/usr/bin/env node
import * as url from 'url'
import * as path from 'path'
import * as fs from 'fs'

const currentDirectory = process.cwd()
const template = path.resolve(
  url.fileURLToPath(import.meta.url),
  '../../template'
)

// Copy our template into the cwd
fs.cpSync(template, currentDirectory, { recursive: true })
