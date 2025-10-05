/**
 * Stores the latest result of callback and makes it
 * retrievable and updateable.
 *
 * Ensures only the latest run of callback is returned when
 * calling `getResult`
 */
export const getLatest = <Res>(
  callback: (old: Res | null) => Promise<Res>
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
    const thisResult = callback(result)
    result = null
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

  return [getResult, update]
}
