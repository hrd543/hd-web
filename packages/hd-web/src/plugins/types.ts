export type HdPlugin<Config> = {
  name: string
  modifyConfig?: (config: Config) => Config | undefined
  onLoad?: {
    filter: RegExp
    load: (args: { path: string }) => Promise<{ code: string }>
  }
  onStart?: (config: Config) => Promise<void>
  onEnd?: (config: Config) => Promise<void>
}
