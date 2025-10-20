export type HdFile = {
  /** Get the src of the file and copy it over to the build folder */
  src: () => Promise<string>
  /** This is the original location on the fs of the file */
  comesFrom: string
}
