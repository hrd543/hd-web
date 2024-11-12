/**
 * Modify the build process to conform to specific providers'
 * build implementations.
 */
export type Adapter = {
  /** Run before build, returns a modified config */
  before?: <Config extends { out: string }>(
    config: Config
  ) => Promise<Config> | Config
  /** Run after build */
  after?: () => Promise<void> | void
}
