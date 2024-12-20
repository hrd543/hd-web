import { BuildOptions } from 'esbuild'

/** The file containing the bundled js for the whole site */
export const buildFile = 'main.js'

export const assetExts = ['jpg', 'webp', 'png']
export const assetFolder = 'assets'

export const defaultConfig: BuildOptions = {
  bundle: true,
  target: 'es6',
  treeShaking: true,
  supported: {
    // We want to support static fields so that the classes
    // can be removed if not actually referenced.
    'class-static-field': true
  },
  // Copy images over
  assetNames: 'static-[name]-[hash]',
  loader: assetExts.reduce((all, ext) => ({ ...all, [`.${ext}`]: 'file' }), {})
}
