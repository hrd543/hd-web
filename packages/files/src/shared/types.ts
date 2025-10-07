export type HdFileInfo<T> = {
  /** The original source of the file */
  src: string
  /** Any modifications to be consumed when copying */
  modifications?: T
}

export type HdFile = {
  /** Get the src of the file and copy it over to the build folder */
  src: string
  /** This is the original location on the fs of the file */
  comesFrom: string
}
