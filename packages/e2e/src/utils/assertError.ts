import assert from 'node:assert'

import { HdError, HdErrorKey } from 'hd-web'

/**
 * Asserts that `fn` throws an `HdError` with key `error`
 */
export const assertError = async (fn: Promise<any>, error: HdErrorKey) => {
  let errorKey: HdErrorKey | undefined = undefined

  try {
    await fn
  } catch (e) {
    if (HdError.getKey(e) === error) {
      errorKey = error
    }
  }

  assert.equal(errorKey, error)
}
