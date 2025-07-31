import { BuildSiteConfig } from './config.js'
import * as esbuild from 'esbuild'
import { type Adapter } from './adapters.js'
import { hdPlugin } from './build.js'

/**
 * Create the html, css and js files for a site.
 *
 * This will run the default page function in entry and use that to create
 * an index.html file for each page in the out directory.
 *
 * Only one js and css file is built at the root, but async imports will
 * be split into their own module.
 *
 * Will delete the contents of out before building!
 *
 * Supply adapters to modify the build for a specific hosting provider.
 */
export const buildSite = async (
  rawConfig: Partial<BuildSiteConfig>,
  adapters?: Adapter[]
) => {
  await esbuild.build({
    target: 'esnext',
    entryPoints: ['./App2.tsx'],
    outfile: 'main.js',
    minify: true,
    format: 'esm',
    plugins: [hdPlugin(rawConfig, adapters)]
  })
}
