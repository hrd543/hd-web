import { ClientProps, DomElement } from '../../types.js'

export const getPropsFromScript = <T>(element: DomElement): ClientProps<T> => {
  if (element.firstElementChild?.tagName === 'SCRIPT') {
    return JSON.parse(element.firstElementChild.textContent ?? '')
  }

  return {} as ClientProps<T>
}
