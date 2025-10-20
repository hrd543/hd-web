import type { OnLoadResult } from 'esbuild'
import nodePath from 'path'

// TODO test this function and make it shareable?
const getPath = (src: string) => {
  const absPath = nodePath.relative(process.cwd(), src).replaceAll('\\', '/')

  if (absPath.startsWith('.')) {
    throw new Error(`Path ${src} must be within cwd`)
  }

  if (absPath.startsWith('/')) {
    return absPath
  }

  return '/' + absPath
}

export const loadCallback = async ({
  path
}: {
  path: string
}): Promise<OnLoadResult> => {
  const contents = `
    import { buildFileExport } from "@hd-web/files"

    export default buildFileExport("${getPath(path)}")
  `

  return {
    contents
  }
}
