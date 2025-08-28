import { BuildResult } from 'esbuild'

import { BuiltFile } from './types.js'
import { readBuildResultFile } from './utils.js'

export const buildReturnResult = (
  out: string,
  outfile: string,
  first: BuildResult,
  final: BuildResult,
  html: BuiltFile[],
  staticFiles?: BuiltFile[]
) => {
  const builtJsFile = final.outputFiles!.find((f) => f.path === outfile)!
  const otherFiles = first.outputFiles!.filter((f) => f.path !== outfile)

  return [
    ...[builtJsFile, ...otherFiles].map((f) => readBuildResultFile(f, out)),
    ...html,
    ...(staticFiles ?? [])
  ]
}
