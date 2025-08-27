import { ModuleGraph } from 'vite'

import { cssFileRegex } from '../stringify/constants.js'

export const getCssImports = (moduleGraph: ModuleGraph) =>
  [...moduleGraph.idToModuleMap.values()]
    .filter((m) => cssFileRegex.test(m.url))
    .map((m) => `import "${m.url}";`)
    .join('')
