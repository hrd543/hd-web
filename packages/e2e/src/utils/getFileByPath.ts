import { type BuiltFile } from 'hd-web'

export const getFileByPath = (files: BuiltFile[]) =>
  files.reduce(
    (all, file) => {
      all[file.relativePath] = file

      return all
    },
    {} as Record<string, BuiltFile>
  )
