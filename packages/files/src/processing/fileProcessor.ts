export interface FileProcessor<T> {
  stringifyModifications: (modifications: T | undefined) => string
  process: (buffer: Buffer, out: string, modifications?: T) => Promise<void>
  getFileType?: (modifications: T | undefined) => string | undefined
  sanitise: (modifications: T | undefined) => T | undefined
}
