// This currently only works if the refs are within the component, so
// they can't be passed down to stateful children.

import { idAttribute } from '../stringify/constants.js'

const getWalker = (root: Element) => {
  return document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, (node) =>
    (node as Element).hasAttribute(idAttribute)
      ? NodeFilter.FILTER_REJECT
      : NodeFilter.FILTER_ACCEPT
  )
}

export function* traverse(root: Element) {
  const walker = getWalker(root)

  for (
    let element = walker.currentNode as Element | null;
    element !== null;
    element = walker.nextNode() as Element | null
  ) {
    yield element
  }
}
