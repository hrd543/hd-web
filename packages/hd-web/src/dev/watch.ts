import fs from 'fs/promises'

import { debounce } from './debounce.js'

export const watch = async (rebuild: () => void) => {
  const watcher = fs.watch(process.cwd(), { recursive: true })
  const debounced = debounce(rebuild, 100)

  for await (const event of watcher) {
    debounced()
  }
}
