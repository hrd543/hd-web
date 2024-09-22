const fileRegex = /^\.?[/\\]/

/** Remove any leading ./ from the filename */
const formatFile = (file: string) => file.replace(fileRegex, '')

// We need to create a proxy object which formats the filename each time
// it is accessed.
const createFileSystem = () =>
  new Proxy<Record<string, string>>(
    {},
    {
      get(target, p) {
        return target[formatFile(p as string)]
      },
      set(target, p, newValue) {
        target[formatFile(p as string)] = newValue

        return true
      },
      has(target, p) {
        return formatFile(p as string) in target
      },
      deleteProperty(target, p) {
        delete target[formatFile(p as string)]

        return true
      }
    }
  )

// This could be replaced with memfs if issues are found, but makes sense
// to try and keep things as simple as possible
export default class FileSystem {
  private files: Record<string, string>
  constructor() {
    this.files = createFileSystem()
  }

  write(filename: string, content: string) {
    this.files[filename] = content
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
    delete this.files[filename]
  }

  clear() {
    this.files = {}
  }

  read(filename: string) {
    return this.files[filename]
  }

  exists(filename: string) {
    return filename in this.files
  }
}
