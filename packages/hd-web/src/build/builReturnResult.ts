import { BuildResult } from 'esbuild'
import path from 'path'

import { BuiltFile } from './types.js'
import { readBuildResultFile } from './utils.js'
import { BuildEndResult } from '../plugins/index.js'

export const buildReturnResult = (
  out: string,
  outfile: string,
  first: BuildResult,
  final: BuildResult | undefined,
  pluginResults: BuildEndResult[],
  html: BuiltFile[],
  staticFiles?: BuiltFile[]
) => {
  const builtJsFile = final?.outputFiles?.find((f) => f.path === outfile)
  const otherFiles = first.outputFiles!.filter((f) => f.path !== outfile)
  const pluginFiles = pluginResults.flatMap<BuiltFile>(({ files }) =>
    files.map((f) => ({
      type: 'file',
      relativePath: f.relativePath,
      path: path.join(process.cwd(), out, f.relativePath)
    }))
  )

  return [
    ...(builtJsFile ? [readBuildResultFile(builtJsFile, out)] : []),
    ...otherFiles.map((f) => readBuildResultFile(f, out)),
    ...pluginFiles,
    ...html,
    ...(staticFiles ?? [])
  ]
}
