const fileRegex = /^\.?[/\\]/

/** Remove any leading ./ from the filename */
const formatFile = (file: string) => file.replace(fileRegex, '')

// This could be replaced with memfs if issues are found, but makes sense
// to try and keep things as simple as possible
/**
 * A very simple alternative to memfs for storing files in memory.
 * Only supports very basic functionality
 */
export default class FileSystem {
  private files: Record<string, string | Uint8Array>
  constructor() {
    this.files = {}
  }

  write(filename: string, content: string | Uint8Array) {
    this.files[formatFile(filename)] = content
  }

  delete(filename: string) {
    delete this.files[formatFile(filename)]
  }

  clear() {
    this.files = {}
  }

  read(filename: string) {
    return this.files[formatFile(filename)]
  }

  exists(filename: string) {
    return formatFile(filename) in this.files
  }
}
