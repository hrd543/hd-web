import * as esbuild from 'esbuild'
import url from 'url'

const getSiteFunctionInMemory = (js: string) => {
  const f = new Function(`${js}; return site`)

  return f().default
}

const getSiteFunctionOnDisk = async (outfile: string) =>
  (await import(/* @vite-ignore */ url.pathToFileURL(outfile).href)).default

export const getSiteFunction = async (
  outfile: string,
  builtFiles?: esbuild.OutputFile[]
) => {
  if (builtFiles) {
    const code = builtFiles.find((f) => f.path === outfile)!.text

    return getSiteFunctionInMemory(code)
  }

  return await getSiteFunctionOnDisk(outfile)
}
