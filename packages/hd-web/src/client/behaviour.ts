import type { BaseProps, IBehaviour } from '@hd-web/jsx'

import { refAttribute } from '../stringify/constants.js'
import { parseProps } from '../stringify/shared/props.js'

export abstract class Behaviour<
  E extends HTMLElement = HTMLElement,
  P extends BaseProps = Record<string, never>
> implements IBehaviour<P>
{
  readonly props: P
  protected el: E

  constructor(element: E) {
    this.props = parseProps(element)
    this.el = element
  }

  /**
   * Get the element referenced by `ref` in your markup.
   *
   * Returns `undefined` if not found.
   *
   * NB - It must be a child of the enhanced element.
   */
  ref(ref: string) {
    return this.el.querySelector(`[${refAttribute}="${ref}"]`)
  }
}
