export type SharedConfig = {
  /** The language of your site, defaults to British English "en-GB" */
  lang: string
  /** Should the titles be joined */
  joinTitles: boolean
  /** The file which contains your App */
  entry: string
  /** Extra file types (including .) which should be included */
  fileTypes: string[]
}

export const defaultSharedConfig: SharedConfig = {
  lang: 'en-GB',
  joinTitles: true,
  entry: 'src/index.tsx',
  fileTypes: []
}
