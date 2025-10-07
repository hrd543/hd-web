import type { OnLoadResult } from 'esbuild'

export const loadCallback = async ({
  path
}: {
  path: string
}): Promise<OnLoadResult> => {
  const contents = `
    import { buildFileExport } from "@hd-web/files"

    export default buildFileExport("${path.replaceAll('\\', '/')}")
  `

  return {
    contents
  }
}
