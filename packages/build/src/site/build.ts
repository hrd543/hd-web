import * as esbuild from 'esbuild'
import fs from 'fs/promises'
import { BuildSiteConfig, validateConfig } from './config.js'
import { buildPages } from '../shared/pages.js'
import path from 'path'
import { writeToHtml } from './writeToHtml.js'
import { getOutFolder, readMetafile } from './pluginHelpers.js'
import { getClientCode } from './client.js'
import { BuiltPage, SiteFunction } from '../shared/types.js'
import ts from 'typescript'

// You have to export your component from the file as its name otherwise it won't
// work.
// E.g. export const Component = ...
// Need to add some sort of warning if not the case

export const hdPlugin = (
  site: SiteFunction,
  rawConfig: Partial<BuildSiteConfig>
): esbuild.Plugin => ({
  name: 'hd-plugin',
  async setup(build) {
    const config = validateConfig(rawConfig)
    const { staticFolder, joinTitles } = config
    const out = getOutFolder(build.initialOptions)
    const outFile = path.join(out, 'main.js')

    // Copy over any static assets
    if (staticFolder) {
      await fs.cp(staticFolder, out, { recursive: true })
    }

    let pages: BuiltPage[] = []

    build.onStart(async () => {
      // Reset the contents of the build folder.
      await fs.rm(out, { recursive: true, force: true })
      await fs.mkdir(out)

      pages = await buildPages(site, joinTitles)

      await fs.writeFile(outFile, getClientCode(pages))
    })

    build.onEnd(async (result) => {
      // Write the html files linking the built files.
      const files = readMetafile(result.metafile!, out)
      await writeToHtml(pages, config, files, out)
    })

    build.onDispose(() => {
      pages = []
    })

    if (!config.dev) {
      build.onLoad({ filter: /\.tsx$/ }, async (args) => {
        const inputCode = await fs.readFile(args.path, 'utf8')
        const sourceFile = ts.createSourceFile(
          args.path,
          inputCode,
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.TSX
        )

        const result = ts.transform(sourceFile, [transformer])

        const printer = ts.createPrinter()
        const outputCode = printer.printFile(result.transformed[0]!)

        return {
          contents: outputCode,
          loader: 'tsx'
        }
      })
    }

    build.initialOptions.entryPoints = [outFile]
    build.initialOptions.allowOverwrite = true
    build.initialOptions.treeShaking = true
    build.initialOptions.bundle = true
    build.initialOptions.metafile = true
  }
})

const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (node: ts.Node): ts.Node | undefined => {
      // Do I need to check more information?
      if (ts.isDecorator(node)) {
        return
      }

      return ts.visitEachChild(node, visitor, context)
    }

    const sourceFileVisitor = (sourceFile: ts.SourceFile): ts.SourceFile => {
      return ts.visitEachChild(sourceFile, visitor, context)
    }

    return ts.visitNode(sourceFile, sourceFileVisitor, ts.isSourceFile)
  }
}
