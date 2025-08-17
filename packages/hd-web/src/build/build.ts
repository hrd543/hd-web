import * as esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'path'
import { buildPages } from './buildPages.js'
import { writeToHtml } from './buildHtml.jsx'
import { addFileToClass } from './addFileToClass.js'
import { getClientJs } from '../client/index.js'
import { BuiltFile } from './types.js'

const plugin = (): esbuild.Plugin => ({
  name: 'hd-plugin',
  setup(build) {
    build.onLoad({ filter: /.+\.client\.[^.\\/]+$/ }, async (args) => {
      const code = await fs.readFile(args.path, { encoding: 'utf-8' })
      console.log(args.path)

      return {
        contents: addFileToClass(code, args.path.replaceAll('\\', '/')),
        loader: 'jsx'
      }
    })
  }
})

const getFileType = (end: string): BuiltFile['type'] => {
  if (end.endsWith('.js') || end.endsWith('.ts')) {
    return 'js'
  }

  if (end.endsWith('.css')) {
    return 'css'
  }

  return 'file'
}

const readMetafile = (metafile: esbuild.Metafile, out: string): BuiltFile[] => {
  return Object.keys(metafile.outputs).reduce((all, file) => {
    all.push({
      path: file,
      relativePath: path.relative(out, file),
      type: getFileType(path.extname(file))
    })

    return all
  }, [] as BuiltFile[])
}

export const build = async () => {
  const built = await esbuild.build({
    plugins: [plugin()],
    platform: 'node',
    bundle: true,
    minify: true,
    entryPoints: ['./App.tsx'],
    outdir: 'build',
    metafile: true,
    format: 'esm',
    loader: {
      '.png': 'file'
    },
    publicPath: '/'
  })

  const site = (await import('./build/App.js')).default

  const pages = await buildPages(site, true)
  // doesn't support splitting yet
  const files = readMetafile(built.metafile, 'build')

  const components = (
    await Promise.all(
      pages.map((page) =>
        writeToHtml(page, { lang: 'en-gb', out: 'build' } as any, files)
      )
    )
  ).flat()

  const js = getClientJs(components.map(({ filename }) => filename))

  await esbuild.build({
    stdin: { contents: js, loader: 'js', resolveDir: '.' },
    minify: true,
    bundle: true,
    treeShaking: true,
    outfile: files.find((f) => f.type === 'js')!.path,
    platform: 'browser',
    format: 'esm',
    allowOverwrite: true
  })
}
