export const getClientCode = (mapEntries: string) => `
const __components = new Map(${mapEntries})

document
  .querySelectorAll('[data-hd-id]')
  .forEach((element) => {
    const Comp = __components.get(element.dataset.hdId ?? '')

    if (Comp) {
      new Comp(element)
    }
  })
`
