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
  onBuildEnd?: (config: Config) => Promise<void>
  apply?: 'dev' | 'build'
}
