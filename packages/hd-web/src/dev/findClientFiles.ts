import { ModuleGraph } from 'vite'
import { clientFileRegex } from '../stringify/index.js'

const getModules = (
  moduleGraph: ModuleGraph,
  components: Array<{ filename: string; key: string }>
) => {
  return components.flatMap(({ key, filename }) => {
    const imports = moduleGraph.getModulesByFile(filename)

    if (!imports) {
      throw new Error(`Module not found at ${filename} for component ${key}`)
    }

    return Array.from(imports)
  })
}

export const findClientFiles = (
  moduleGraph: ModuleGraph | undefined,
  components: Array<{ filename: string; key: string }>
) => {
  if (!moduleGraph) {
    return components.map(({ filename }) => filename)
  }

  const visited = new Set<string>()
  const files: string[] = []

  const modules = getModules(moduleGraph, components)

  while (modules.length) {
    const m = modules.pop()!

    if (visited.has(m.url)) {
      continue
    }

    visited.add(m.url)

    for (const node of m.importedModules) {
      if (clientFileRegex.test(node.url)) {
        files.push(node.url)
      } else {
        modules.push(node)
      }
    }
  }

  return files
}
