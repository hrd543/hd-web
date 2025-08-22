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

const getMapInit = (count: number) => {
  const entries = Array.from({ length: count }, (x, i) => i)
    .map((i) => `[_${i}.key, _${i}]`)
    .join(',')

  return '[' + entries + ']'
}

export const getClientJs = (clientFiles: string[]) => {
  const uniqueFiles = Array.from(new Set(clientFiles))
  const imports = uniqueFiles
    .map((file, i) => `import _${i} from "${file}";`)
    .join('')
  const mapInit = getMapInit(uniqueFiles.length)

  return imports + getInitialiseCode(mapInit)
}
