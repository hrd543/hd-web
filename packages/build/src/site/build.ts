import * as esbuild from 'esbuild'
import fs from 'fs/promises'
import { renderToString } from '@hd-web/jsx'
import { BuiltPage } from '../shared/types.js'
import { BuildSiteConfig, validateConfig } from './config.js'
import { buildPages } from '../shared/pages.js'
import path from 'path'
import { BuiltFile, writeToHtml } from './writeToHtml.js'
import { Adapter, runAfterAdapters, runBeforeAdapters } from './adapters.js'

const loopComponents = (components: Map<string, string>) => {
  const imports: string[] = []
  const entries: string[] = []

  components.entries().forEach(([name, file]) => {
    // Get rid of the leading file:///
    imports.push(`import ${name} from "${file.slice(8)}";`)
    entries.push(`["${name}", ${name}]`)
  })

  return {
    imports: imports.join(''),
    entries: '[' + entries.join(',') + ']'
  }
}

const getHtml = (
  pages: BuiltPage[]
): { map: Map<string, string>; html: string[] } => {
  const all: Map<string, string> = new Map()
  const html: string[] = []

  pages.forEach(([, site]) => {
    const { components, html: thisHtml } = renderToString(site.body)
    components.entries().forEach((pair) => all.set(...pair))
    html.push(thisHtml)
  })

  return {
    html,
    map: all
  }
}

const getEntryPoint = ({ entryPoints }: esbuild.BuildOptions): string => {
  if (!Array.isArray(entryPoints) || entryPoints.length !== 1) {
    throw new Error('Expected entry points to be a single element array')
  }

  const entry = entryPoints[0]!

  if (typeof entry !== 'string') {
    throw new Error('Expected entry point to be a string')
  }

  return entry
}

const getOutFolder = ({ outdir }: esbuild.BuildOptions): string => {
  if (!outdir) {
    throw new Error('Expected outdir to be present')
  }

  return outdir
}

const readMetafile = (
  metafile: esbuild.Metafile,
  entry: string,
  out: string
): BuiltFile[] => {
  return Object.entries(metafile.outputs).reduce((all, [file, output]) => {
    const builtFile: BuiltFile = {
      path: file,
      relativePath: path.relative(out, file),
      type: path.extname(file)
    }

    // This means the file is the main entry point
    if (output.entryPoint === entry) {
      builtFile.isEntry = true
    }

    all.push(builtFile)

    return all
  }, [] as BuiltFile[])
}

export const hdPlugin = (
  rawConfig: Partial<BuildSiteConfig>,
  adapters?: Adapter[]
): esbuild.Plugin => ({
  name: 'hd-plugin',
  async setup(build) {
    const config = await runBeforeAdapters(validateConfig(rawConfig), adapters)
    const { staticFolder, joinTitles } = config
    const entry = getEntryPoint(build.initialOptions)
    const out = getOutFolder(build.initialOptions)
    const outFile = path.join(out, 'main.js')

    // Delete the build folder
    await fs.rm(out, { recursive: true, force: true })

    // Copy over any static assets
    if (staticFolder) {
      await fs.cp(staticFolder, out, { recursive: true })
    }

    const pages = await buildPages(
      (await import(import.meta.resolve(entry))).default,
      joinTitles
    )

    const { map, html } = getHtml(pages)
    const { imports, entries } = loopComponents(map)

    await fs.writeFile(
      outFile,
      `
        ${imports}
        import { client } from "./client.ts"

        client(new Map(${entries}));
      `
    )

    build.onEnd(async (result) => {
      // Write the html files linking the built files.
      const files = readMetafile(result.metafile!, entry, out)
      await writeToHtml(pages, config, files, html, out)

      await runAfterAdapters(config, adapters)
    })

    build.initialOptions.entryPoints = [outFile]
    build.initialOptions.allowOverwrite = true
    build.initialOptions.treeShaking = true
    build.initialOptions.bundle = true
    build.initialOptions.metafile = true
  }
})
