import { ModuleGraph } from 'vite'

export const findClientFiles = (
  moduleGraph: ModuleGraph,
  components: Array<{ filename: string; key: string }>
): string[] => {
  // First, load all client files which aren't in node_modules
  // as they won't have the __file static prop
  const localClientFiles = moduleGraph.fileToModulesMap
    .keys()
    .toArray()
    .filter(
      (file) => file.endsWith('.client.ts') && !file.includes('node_modules')
    )

  // Then get all the ones used in components
  const componentFiles = components.map(({ filename }) => filename)

  return localClientFiles.concat(componentFiles)
}
