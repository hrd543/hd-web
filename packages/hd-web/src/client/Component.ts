import { BaseProps, ClientProps } from '../jsx/index.js'
import { parseListeners, parseProps } from '../stringify/index.js'
import { traverse } from './traverse.js'

export abstract class Component<
  T extends BaseProps = BaseProps,
  E extends SVGElement | HTMLElement = SVGElement | HTMLElement
> {
  protected readonly props: ClientProps<T>
  // TODO this is a strong reference, check if memory issues.
  // I should probably add some way of deleting this class
  // if its element is removed from the dom
  protected refs: Map<string, Element>
  protected el: E

  constructor(element: E) {
    this.props = parseProps(element)
    this.refs = new Map()
    this.el = element

    traverse(this.el, (element) => {
      // TODO make this use some shared function for hdRef / hdListen
      const ref = element.dataset.hdRef
      const listen = element.dataset.hdListen

      if (ref !== undefined) {
        this.refs.set(ref, element)
      }

      if (listen) {
        parseListeners(listen)?.forEach(([event, method]) => {
          element.addEventListener(
            event!,
            (this[method as keyof this] as () => void).bind(this)
          )
        })
      }
    })
  }

  // I could add a dispatch / listen method to each component class.
  // I would need to pass in a map of all components with their id, and
  // pass this component's id to it.
  // Then you could dispatch custom events between components.
}
