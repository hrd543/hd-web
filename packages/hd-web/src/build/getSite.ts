import * as esbuild from 'esbuild'
import url from 'url'

const getSiteInMemory = (js: string) => {
  const f = new Function(`${js}; return site`)

  return f().default
}

const getSiteOnDisk = async (outfile: string) =>
  (await import(url.pathToFileURL(outfile).href)).default

export const getSite = async (
  outfile: string,
  builtFiles?: esbuild.OutputFile[]
) => {
  if (builtFiles) {
    const code = builtFiles.find((f) => f.path === outfile)!.text

    return getSiteInMemory(code)
  }

  return await getSiteOnDisk(outfile)
}
