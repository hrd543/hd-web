export type InterruptFunction = (
  task: Promise<void>,
  queuedFiles: string[]
) => Promise<void>

const defaultInterruptor: InterruptFunction = (task) => task

/**
 * Make sure that callback is run at most once every timer ms.
 *
 * When called, pass a list of files that were called within
 * that time.
 */
export const debounce = <T extends unknown[]>(
  callback: (changes: string[], ...args: T) => Promise<void>,
  timer: number,
  fileDenyList?: string[],
  onInterrupt = defaultInterruptor
) => {
  const fileDenySet = fileDenyList ? new Set(fileDenyList) : undefined
  let files = new Set<string>()
  let task: Promise<void> | null = null
  let timeout: NodeJS.Timeout | undefined = undefined

  return async (file: string | null, ...args: T) => {
    if (!file || fileDenySet?.has(file)) {
      return
    }

    files.add(file)

    clearTimeout(timeout)
    timeout = setTimeout(async () => {
      // If we're currently running a task, wait for it to finish
      // before starting a new one.
      if (task) {
        await onInterrupt(task, Array.from(files))
        task = null
      }

      const fileArray = Array.from(files)
      files = new Set()
      task = callback(fileArray, ...args)
    }, timer)
  }
}
