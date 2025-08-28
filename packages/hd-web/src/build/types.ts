export type BuiltFile = {
  path: string
  relativePath: string
  type: 'css' | 'js' | 'file'
  /**
   * The contents of the file.
   *
   * Only available for css and js files when write = false
   */
  contents?: string
}
