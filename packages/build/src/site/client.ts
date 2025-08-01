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

const getImports = (components: Map<string, string>) => {
  return components
    .entries()
    .toArray()
    .map(([name, file]) => `import ${name} from "${file.slice(8)}"`)
    .join(';')
}

const getMapInit = (components: Map<string, string>) => {
  const entries = components
    .keys()
    .toArray()
    .map((name) => `["${name}", ${name}]`)
    .join(',')

  return '[' + entries + ']'
}

export const getClientCode = (components: Map<string, string>) => {
  const imports = getImports(components)
  const mapInit = getMapInit(components)

  return `${imports}; ${getInitialiseCode(mapInit)}`
}
