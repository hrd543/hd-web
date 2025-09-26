import path from 'path'

export const getBuildSrc = (out: string, src: string) => {
  const filename = path.basename(src)

  return {
    // This represents the file within our filesystem, useful for copying
    src: path.posix.join(out, filename),
    // This is the one which should be attached to the src attribute
    // The leading / is so that paths are relative to the root.
    relativeSrc: `/${path.posix.join('images', filename)}`
  }
}
