export type BuildEndResult = {
  /**
   * If `write` is set to false, then don't write the files to the
   * filesystem, but instead return those which were going to be written
   */
  files: Array<{ relativePath: string }>
}

type Promiseish<T> = T | Promise<T>

export type OnResolveArgs<Config> = {
  /** The path of the thing be imported */
  path: string
  config: Config
  /** The path of the thing importing */
  importer: string
  /** The type of file doing the importing */
  type: 'js' | 'css'
}

export type OnResolveResult = {
  /** Use this to optionally rewrite the import path */
  path?: string
  /** Use this to optionally ignore processing this file via `onLoad` */
  external?: boolean
}

export type OnLoadArgs<Config> = {
  /** The path of the module being loaded */
  path: string
  config: Config
}

export type OnLoadResult = {
  /** The contents of the js to be loaded when importing */
  contents: string
}

export type Plugin<Config> = {
  /** The name of this plugin */
  name: string
  /** Runs before build to optionally alter the config */
  modifyConfig?: (config: Config) => Config | undefined
  /** Runs whenever a file matching the filter is loaded */
  onLoad?: {
    filter: RegExp
    load: (args: OnLoadArgs<Config>) => Promiseish<OnLoadResult>
  }
  /** Runs whenever a file matching the filter has its import resolved */
  onResolve?: {
    filter: RegExp
    resolve: (
      args: OnResolveArgs<Config>
    ) => Promiseish<OnResolveResult | void | undefined>
  }
  /** Runs at the start of every rebuild */
  onBuildStart?: (config: Config) => Promiseish<void>
  /** Runs at the end of every rebuild */
  onBuildEnd?: (config: Config) => Promiseish<BuildEndResult | void>
  /** Should this apply to dev or build (or both if undefined) */
  apply?: 'dev' | 'build'
}
