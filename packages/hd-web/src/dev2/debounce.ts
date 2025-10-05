export const debounce = (callback: () => void, wait: number) => {
  let timeoutId: NodeJS.Timeout | null = null

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      callback()
    }, wait)
  }
}
