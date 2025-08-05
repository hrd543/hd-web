// This currently only works if the refs are within the component, so

import { DomElement } from '../../types.js'
import { idAttribute } from '../shared/constants.js'

// they can't be passed down to stateful children.
export const traverse = (
  root: Element | null,
  process: (element: DomElement) => void
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

    process(element as DomElement)
    stack.push(element.firstElementChild)
  }
}
