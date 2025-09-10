import { errors, HdErrorKey, HdErrors } from './errors.js'

export class HdError<T extends HdErrorKey> extends Error {
  key: T

  constructor(key: T, ...args: Parameters<HdErrors[T]>) {
    // @ts-expect-error This is typed correctly when calling constructor()
    const message = errors[key](...args)
    super(message)
    this.key = key
  }

  static getKey(e: unknown): HdErrorKey | undefined {
    if (!(e instanceof HdError)) {
      return
    }

    return e.key
  }

  override toString() {
    return `\n❌ Hd build error!\n\n${this.message}`
  }
}
