import * as esbuild from 'esbuild'

export type SharedConfig = {
  /** The language of your site, defaults to British English "en-GB" */
  lang: string
  /** Should the titles be joined */
  joinTitles: boolean
  /** The file which contains your App */
  entry: string
  /** Should it write to the filesystem? Useful for tests; defaults to true */
  write: boolean
}

export const defaultSharedConfig: SharedConfig = {
  lang: 'en-GB',
  joinTitles: true,
  entry: 'src/index.tsx',
  write: true
}
