/**
 * Make sure that each file is only run at most once every timer ms
 */
export const debounce = <T extends [string | null, ...unknown[]]>(
  callback: (...args: T) => void,
  timer: number
) => {
  const timeouts: Record<string, NodeJS.Timeout> = {}

  return (...args: T) => {
    const file = args[0]
    if (!file) {
      return
    }

    clearTimeout(timeouts[file])
    timeouts[file] = setTimeout(() => {
      callback(...args)
      delete timeouts[file]
    }, timer)
  }
}
