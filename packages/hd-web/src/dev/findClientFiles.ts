import { ModuleGraph } from 'vite'

import { HdError } from '../errors/index.js'
import { clientFileRegex } from '../stringify/index.js'

const getModules = (
  moduleGraph: ModuleGraph,
  components: Array<{ filename: string; key: string }>
) => {
  return components.flatMap(({ key, filename }) => {
    const imports = moduleGraph.getModulesByFile(filename)

    if (!imports) {
      throw new HdError('comp.notFound', key, filename)
    }

    return Array.from(imports)
  })
}

export const findClientFiles = (
  moduleGraph: ModuleGraph,
  components: Array<{ filename: string; key: string }>
): string[] => {
  const visited = new Set<string>()
  const js: string[] = []

  const modules = getModules(moduleGraph, components)

  while (modules.length) {
    const m = modules.pop()!

    if (visited.has(m.url)) {
      continue
    }

    visited.add(m.url)

    if (clientFileRegex.test(m.url)) {
      js.push(m.url)
    }

    modules.push(...m.importedModules)
  }

  return js
}
