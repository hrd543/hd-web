import type { BaseProps, ClientProps } from '@hd-web/jsx'

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

export const parseProps = <T>(
  element: SVGElement | HTMLElement
): ClientProps<T> => {
  if (element.firstElementChild?.tagName === 'SCRIPT') {
    return JSON.parse(element.firstElementChild.textContent ?? '')
  }

  return {} as ClientProps<T>
}
