#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'

const currentDirectory = process.cwd()
const template = path.resolve(
  url.fileURLToPath(import.meta.url),
  '../../template'
)

// Copy our template into the cwd
fs.cpSync(template, currentDirectory, { recursive: true })
