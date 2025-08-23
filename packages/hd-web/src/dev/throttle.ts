export const throttle = <Res>(
  callback: () => Promise<Res>
): [getResult: () => Promise<Res | null>, update: () => void] => {
  let promise: Promise<Res> | null
  let resolve: ((r: Res | null) => void) | undefined
  // Once done, we store the result here
  let result: Res | null

  const getResult = async () => {
    resolve?.(null)

    if (result) {
      return result
    }

    return new Promise<Res | null>((res) => {
      resolve = res
    })
  }

  const update = () => {
    result = null
    const thisResult = callback()
    promise = thisResult

    thisResult.then((r) => {
      if (promise === thisResult) {
        resolve?.(r)
        promise = null
        resolve = undefined
        result = r
      }
    })
  }

  update()

  return [getResult, update]
}
