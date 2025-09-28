export type BuildEndResult = {
  /**
   * If `write` is set to false, then don't write the files to the
   * filesystem, but instead return those which were going to be written
   */
  files: Array<{ relativePath: string }>
}

type Promiseish<T> = T | Promise<T>

export type OnResolveArgs<Config> = {
  path: string
  config: Config
  importer: string
  type: 'js' | 'css'
}

export type OnResolveResult = {
  path?: string
  external?: boolean
}

export type OnLoadArgs<Config> = {
  path: string
  config: Config
}

export type OnLoadResult = {
  contents: string
}

export type Plugin<Config> = {
  name: string
  modifyConfig?: (config: Config) => Config | undefined
  onLoad?: {
    filter: RegExp
    load: (args: OnLoadArgs<Config>) => Promiseish<OnLoadResult>
  }
  onResolve?: {
    filter: RegExp
    resolve: (
      args: OnResolveArgs<Config>
    ) => Promiseish<OnResolveResult | void | undefined>
  }
  onBuildStart?: (config: Config) => Promiseish<void>
  onBuildEnd?: (config: Config) => Promiseish<BuildEndResult | void>
  apply?: 'dev' | 'build'
}
