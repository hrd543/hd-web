import { BuildOptions } from 'esbuild'

/** The file used to export all the page functions */
export const tempBuildFile = '_main.js'

/** The file containing the bundled js for the whole site */
export const buildFile = 'main.js'

export const defaultConfig: BuildOptions = {
  bundle: true,
  target: 'es6',
  treeShaking: true,
  supported: {
    // We want to support static fields so that the classes
    // can be removed if not actually referenced.
    'class-static-field': true
  }
}
