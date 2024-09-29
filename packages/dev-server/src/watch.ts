import fs from 'fs/promises'
import { debounce, InterruptFunction } from './debounce.js'

/**
 * Watch for changes and run the change handler.
 * @param dir The directory to check for changes
 * @param onChange The function to be run on each change
 * @param debounceTimer The time (in ms) to debounce the change handler.
 * This is useful if saving multiple files at once => only one change event is fired.
 * @param fileDenyList Which files should be ignored
 * @param onInterrupt Callback to be run if a change is made while the change
 * callback is still running.
 */
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
