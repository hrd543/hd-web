import assert from 'assert/strict'
import { describe, it, beforeEach } from 'node:test'
import { vol } from 'memfs'
import { removeExports } from './processJs.js'

const fs = vol.promises
const filename = `/test.js`

const longFile = Array.from({ length: 100 }, () => 'hello there').join('\n')

const createFile = async (content: string) => {
  await fs.writeFile(filename, content)
  // memfs doesn't type the file handle well
  return (await fs.open(filename, 'r+')) as any
}

const shouldEqual = async (file: any, content: string) => {
  await file.close()
  assert.equal(content, await fs.readFile(filename, 'utf-8'))
}

describe('removeExports', () => {
  beforeEach(() => {
    vol.reset()
  })

  it('should throw for an empty file', async () => {
    const file = await createFile('')
    await assert.rejects(async () => await removeExports(file), {
      message: "Couldn't find export statement"
    })
    await file.close()
  })

  it('should throw for a file w/out export', async () => {
    const file = await createFile(longFile)
    await assert.rejects(async () => await removeExports(file), {
      message: "Couldn't find export statement"
    })
    await file.close()
  })

  it('should throw for a file w/out export and semi colons', async () => {
    const file = await createFile(longFile.concat(';some statement;\n\r'))
    await assert.rejects(async () => await removeExports(file), {
      message: "Last statement didn't contain the word export"
    })
    await file.close()
  })

  it('should throw for a file with export but no semi colon', async () => {
    const file = await createFile(longFile.concat('export;\n\r'))
    await assert.rejects(async () => await removeExports(file), {
      message: "Couldn't find export statement"
    })
    await file.close()
  })

  it('should remove the export statement', async () => {
    const file = await createFile(longFile.concat(';export;\n\r'))
    await removeExports(file)
    await shouldEqual(file, `${longFile};`)
  })

  it('should remove the export statement with exports', async () => {
    const file = await createFile(
      longFile.concat(
        ';export {default as SomeReallyLongNameThatMightSpillOver};\n\r'
      )
    )
    await removeExports(file)
    await shouldEqual(file, `${longFile};`)
  })

  it('should remove the export with exports just over the chunk', async () => {
    const file = await createFile(
      // This export is 42 characters (bytes) which means the export text
      // should be split into two chunks
      longFile.concat(';export {default as SomeReallyLongNameHere};\n\r')
    )
    await removeExports(file, 40)
    await shouldEqual(file, `${longFile};`)
  })
})
