import fs from 'fs/promises'

const semiColonSize = Buffer.byteLength(';\n\r', 'utf-8')

/**
 * Remove the export statement at the end of the file, checking from the
 * end, in chunks of size chunkSize
 */
export const removeExports = async (file: fs.FileHandle, chunkSize = 40) => {
  const fileSize = (await file.stat()).size
  let bytesToRemove = 0
  // Keep track of whether the previous string contained part of "export"
  let lastSixLetters = ''
  for (
    // start at the end of the file, ignoring the trailing semi colon
    let cursor = fileSize - semiColonSize;
    cursor >= 0;
    cursor -= chunkSize
  ) {
    const buffer = Buffer.alloc(Math.min(chunkSize, fileSize))
    await file.read(buffer, 0, chunkSize, Math.max(cursor - chunkSize, 0))
    const str = buffer.toString('utf-8')
    const scIndex = str.lastIndexOf(';')
    // This means we've found the export statement
    if (scIndex >= 0) {
      if (!str.concat(lastSixLetters).includes('export')) {
        throw new Error("Last statement didn't contain the word export")
      }
      const exportStringSize = Buffer.byteLength(str.substring(scIndex + 1))
      bytesToRemove = exportStringSize + fileSize - cursor

      break
    }
    lastSixLetters = str.substring(0, 6)
  }

  if (bytesToRemove) {
    await file.truncate(fileSize - bytesToRemove)
  } else {
    throw new Error("Couldn't find export statement")
  }
}
