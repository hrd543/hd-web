import type { DomElement, ClientProps, BaseProps } from '../../jsx/index.js'

export const serialiseProps = <T extends BaseProps>(
  props?: T | null
): string | null => {
  if (!props) {
    return null
  }

  const newProps: Record<string, unknown> = {}

  for (const key in props) {
    if (key.startsWith('_') && props[key] !== undefined) {
      newProps[key] = props[key]
    }
  }

  return Object.keys(newProps).length ? JSON.stringify(newProps) : null
}

export const parseProps = <T>(element: DomElement): ClientProps<T> => {
  if (element.firstElementChild?.tagName === 'SCRIPT') {
    return JSON.parse(element.firstElementChild.textContent ?? '')
  }

  return {} as ClientProps<T>
}
