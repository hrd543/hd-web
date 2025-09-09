import { errors, HdErrorKey, HdErrors } from './errors.js'

export class HdError<T extends HdErrorKey> extends Error {
  key: T

  constructor(key: T, ...args: Parameters<HdErrors[T]>) {
    const message = errors[key](...(args as [any]))
    super(message)
    this.key = key
  }

  static getKey(e: unknown): HdErrorKey | undefined {
    if (!(e instanceof HdError)) {
      return
    }

    return e.key
  }
}
