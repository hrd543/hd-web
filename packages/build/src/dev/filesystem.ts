const fileRegex = /^\.?[/\\]/

/** Remove any leading ./ from the filename */
const formatFile = (file: string) => file.replace(fileRegex, '')

// This could be replaced with memfs if issues are found, but makes sense
// to try and keep things as simple as possible
export default class FileSystem {
  private files: Record<string, string>
  constructor() {
    this.files = {}
  }

  write(filename: string, content: string) {
    this.files[formatFile(filename)] = content
  }

  writeMultiple(filenames: string[], contents: string[]) {
    if (filenames.length !== contents.length) {
      return
    }

    filenames.forEach((name, i) => {
      this.write(name, contents[i]!)
    })
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
