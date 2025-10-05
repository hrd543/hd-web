import * as esbuild from 'esbuild'
import { HdError } from '../errors/HdError.js'
import { buildSite } from '../shared/index.js'
import { DevConfig } from './config.js'
import { DevRebuild } from './types.js'

export const rebuildDev = async (
  config: DevConfig,
  context: esbuild.BuildContext
): Promise<DevRebuild> => {
  try {
    const bef = performance.now()
    const first = await context.rebuild()
    const jsFile = first.outputFiles!.find((f) => f.path.endsWith('.js'))!
    const css = first.outputFiles!.find((f) => f.path.endsWith('.css'))!.text
    const site = await buildSite(getSiteInMemory(jsFile.text), config)

    console.log('Took: ', performance.now() - bef)

    return {
      site,
      css
    }
  } catch (e: unknown) {
    if (!isEsbuildError(e)) {
      throw e
    }

    throw new HdError('fs.fileType', e.message)
  }
}

const getSiteInMemory = (js: string) => {
  const f = new Function(`${js}; return site`)

  return f().default
}

const isEsbuildError = (e: unknown): e is esbuild.BuildFailure =>
  e instanceof Error &&
  'errors' in e &&
  Array.isArray(e.errors) &&
  e.errors.length > 0
