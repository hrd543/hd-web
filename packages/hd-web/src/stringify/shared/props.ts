import type { BaseProps } from '@hd-web/jsx'

export const serialiseProps = <T extends BaseProps>(
  props?: T | null
): string | null => {
  if (!props) {
    return null
  }

  return Object.keys(props).length ? JSON.stringify(props) : null
}

export const parseProps = <T>(element: SVGElement | HTMLElement): T => {
  if (element.firstElementChild?.tagName === 'SCRIPT') {
    return JSON.parse(element.firstElementChild.textContent ?? '')
  }

  return {} as T
}
