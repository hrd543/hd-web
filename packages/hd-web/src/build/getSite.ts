import * as esbuild from 'esbuild'
import url from 'url'
import { getSiteInMemory } from '../shared/index.js'

const getSiteOnDisk = async (outfile: string) =>
  (await import(url.pathToFileURL(outfile).href)).default

export const getSite = async (
  outfile: string,
  builtFiles?: esbuild.OutputFile[]
) => {
  if (builtFiles) {
    const code = builtFiles.find((f) => f.path === outfile)!.text

    return await getSiteInMemory(code)
  }

  return await getSiteOnDisk(outfile)
}
