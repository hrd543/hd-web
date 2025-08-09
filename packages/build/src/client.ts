import { BuiltPage } from './types.js'

const reduceMap = <K, V>(maps: Array<Map<K, V>>): Map<K, V> => {
  return maps.reduce((full, map) => {
    map.entries().forEach(([k, v]) => full.set(k, v))

    return full
  }, new Map<K, V>())
}

const componentsVar = '__components'

const getInitialiseCode = (mapEntries: string) => `
const ${componentsVar} = new Map(${mapEntries})

document
  .querySelectorAll('[data-hd-id]')
  .forEach((element) => {
    const Comp = ${componentsVar}.get(element.dataset.hdId ?? '')

    if (Comp) {
      new Comp(element)
    }
  })
`

const getMapInit = (components: Map<string, string>) => {
  const entries = components
    .entries()
    .toArray()
    .map(([name, variable]) => `["${name}", ${variable}]`)
    .join(',')

  return '[' + entries + ']'
}

export const getClientCode = (pages: BuiltPage[]) => {
  const allComponents = reduceMap(pages.map(([, { components }]) => components))
  const mapInit = getMapInit(allComponents)

  return getInitialiseCode(mapInit)
}
