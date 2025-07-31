import { type JSX } from '@hd-web/jsx'

export const client = <T extends JSX.BaseProps>(
  components: Map<string, JSX.IComponent<T>>
) => {
  document
    .querySelectorAll<HTMLElement | SVGElement>(`[data-hd-id]`)
    .forEach((element) => {
      const Comp = components.get(element.dataset.hdId ?? '')

      if (Comp) {
        new Comp(element)
      }
    })
}
