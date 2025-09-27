export type HdBuildEndResult = {
  /**
   * If `write` is set to false, then don't write the files to the
   * filesystem, but instead return those which were going to be written
   */
  files: Array<{ relativePath: string }>
}

export type HdPlugin<Config> = {
  name: string
  modifyConfig?: (config: Config) => Config | undefined
  onLoad?: {
    filter: RegExp
    load: (args: {
      path: string
      config: Config
    }) => Promise<{ contents: string }>
  }
  onBuildStart?: (config: Config) => Promise<void>
  onBuildEnd?: (config: Config) => Promise<HdBuildEndResult | void>
  apply?: 'dev' | 'build'
}
