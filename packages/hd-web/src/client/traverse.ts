// This currently only works if the refs are within the component, so
// they can't be passed down to stateful children.

import { idAttribute } from '../stringify/constants.js'

export const traverse = (
  root: Element | null,
  process: (element: SVGElement | HTMLElement) => void
) => {
  const stack = [root?.firstElementChild]

  while (stack.length > 0) {
    const element = stack.pop()

    if (!element) {
      continue
    }

    stack.push(element.nextElementSibling)

    if (element.hasAttribute(idAttribute)) {
      continue
    }

    process(element as SVGElement | HTMLElement)
    stack.push(element.firstElementChild)
  }
}
