import { BuildSiteConfig, validateConfig } from '../site/config.js'
import fs from 'fs/promises'
import { debounce } from './debounce.js'

const handleChange = debounce((file) => {
  console.log(file)
}, 100)

export const startDev = async (rawConfig: Partial<BuildSiteConfig>) => {
  const config = validateConfig(rawConfig)
  const watcher = fs.watch(config.entryDir, { recursive: true })

  for await (const event of watcher) {
    handleChange(event.filename)
  }
}

startDev({ entryDir: 'site' })
