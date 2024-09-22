import fs from 'fs/promises'
import { debounce, InterruptFunction } from './debounce.js'

export const watch = async (
  dir: string,
  onChange: (changedFiles: string[]) => Promise<void>,
  debounceTimer = 100,
  fileDenyList?: string[],
  onInterrupt?: InterruptFunction
) => {
  const handleChange = debounce(
    onChange,
    debounceTimer,
    fileDenyList,
    onInterrupt
  )
  const watcher = fs.watch(dir, { recursive: true })

  for await (const event of watcher) {
    await handleChange(event.filename)
  }
}
