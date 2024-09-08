import { BuildSiteConfig, validateConfig } from '../site/config.js'
import fs from 'fs/promises'
import { debounce } from './debounce.js'
import { buildSite } from '../site/buildSite.js'

const handleChange = debounce(async (files, config: BuildSiteConfig) => {
  await buildSite(config)
}, 100)

export const startDev = async (rawConfig: Partial<BuildSiteConfig>) => {
  const config = validateConfig(rawConfig)
  const watcher = fs.watch(config.entryDir, { recursive: true })

  for await (const event of watcher) {
    handleChange(event.filename, config)
  }
}

startDev({ entryDir: 'site' })
