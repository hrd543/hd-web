import type { BaseProps, ClientProps } from '@hd-web/jsx'
import { parseListeners } from '../stringify/shared/listeners.js'
import { traverse } from './traverse.js'
import { parseProps } from '../stringify/shared/props.js'
import { listenerAttribute, refAttribute } from '../stringify/constants.js'

export abstract class Component<
  T extends BaseProps = BaseProps,
  E extends SVGElement | HTMLElement = SVGElement | HTMLElement
> {
  protected readonly props: ClientProps<T>
  protected el: E

  constructor(element: E) {
    this.props = parseProps(element)
    this.el = element

    for (const e of traverse(element)) {
      const listen = e.getAttribute(listenerAttribute)

      if (listen) {
        parseListeners(listen).forEach(([event, method]) => {
          element.addEventListener(
            event,
            (this[method as keyof this] as () => void).bind(this)
          )
        })
      }
    }
  }

  /**
   * Get the element referenced by `ref` in your markup.
   *
   * Returns `undefined` if not found.
   *
   * NB it will not check stateful children, so you can only reference
   * children within this component.
   */
  ref(ref: string) {
    for (const e of traverse(this.el)) {
      if (e.getAttribute(refAttribute) === ref) {
        return e
      }
    }
  }
}
