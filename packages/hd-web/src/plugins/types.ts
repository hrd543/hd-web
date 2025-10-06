import * as esbuild from 'esbuild'

export type Plugin<Config> = {
  /** The name of this plugin */
  name: string

  /**
   * The esbuild setup function to be run when bundling the code
   * to be run on the server.
   *
   * Useful for loading and resolving files e.g.
   *
   * (Similar to esbuild's `setup` function within a plugin)
   */
  bundleSetup?: (
    build: esbuild.PluginBuild,
    config: Config
  ) => void | Promise<void>

  /** Runs before the very start of the hd-web site build */
  onStart?: (config: Config) => void | Promise<void>
  /** Runs at the very end of the hd-web site build */
  onEnd?: (config: Config) => void | Promise<void>

  /** Runs before the site routes have been regenerated */
  onSiteStart?: (config: Config) => void | Promise<void>
  /** Runs after the site routes have been regenerated */
  onSiteEnd?: (config: Config) => void | Promise<void>

  /** Runs before the page(s) have been rebuilt */
  onPageStart?: (config: Config) => void | Promise<void>
  /** Runs after the page(s) have been rebuilt */
  onPageEnd?: (config: Config) => void | Promise<void>

  /** Should this apply to dev or build (or both if undefined) */
  apply?: 'build' | 'dev'
}
