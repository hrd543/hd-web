import { BuildResult, OutputFile } from 'esbuild'

export const buildReturnResult = (
  outfile: string,
  first: BuildResult,
  final: BuildResult,
  html: OutputFile[]
) => {
  const builtJsFile = final.outputFiles!.find((f) => f.path === outfile)!
  const otherFiles = first.outputFiles!.filter((f) => f.path !== outfile)

  return [builtJsFile, ...otherFiles, ...html]
}
