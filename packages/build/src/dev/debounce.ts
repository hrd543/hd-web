/**
 * Make sure that callback is run at most once every timer ms.
 *
 * When called, pass a list of files that were called within
 * that time.
 */
export const debounce = <T extends unknown[]>(
  callback: (changes: string[], ...args: T) => Promise<void> | void,
  timer: number
) => {
  let files = new Set<string>()
  let timeout: NodeJS.Timeout | undefined = undefined

  return (file: string | null, ...args: T) => {
    if (!file) {
      return
    }

    files.add(file)
    clearTimeout(timeout)
    timeout = setTimeout(async () => {
      const fileArray = Array.from(files)
      files = new Set()
      await callback(fileArray, ...args)
    }, timer)
  }
}
