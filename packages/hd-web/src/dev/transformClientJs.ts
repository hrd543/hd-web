import * as esbuild from 'esbuild'
import { HdError, isEsbuildError } from '../errors/index.js'

export const transformClientJs = async (js: string) => {
  try {
    const { outputFiles } = await esbuild.build({
      minify: false,
      bundle: true,
      target: 'esnext',
      write: false,
      logLevel: 'silent',
      stdin: { contents: js, loader: 'js', resolveDir: '.' },
      // Needed to track the compiled code
      outfile: 'main.js',
      platform: 'browser',
      allowOverwrite: true,
      format: 'esm'
    })

    return outputFiles.find((x) => x.path.endsWith('.js'))!.text
  } catch (e: unknown) {
    if (!isEsbuildError(e)) {
      throw e
    }

    const reason = e.errors[0]!.text

    if (defaultExportRegex.test(reason)) {
      throw new HdError('comp.defaultExport', reason)
    } else {
      throw e
    }
  }
}

const defaultExportRegex =
  /No matching export in "[^"]+\.client.ts" for import "default"/
