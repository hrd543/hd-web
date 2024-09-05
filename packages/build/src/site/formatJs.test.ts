import assert from 'assert/strict'
import { describe, it, beforeEach } from 'node:test'
import { vol } from 'memfs'
import { removeExports } from './formatJs.js'

const fs = vol.promises
const filename = `/test.js`

const longFile = Array.from({ length: 100 }, () => 'hello there').join('\n')

describe('removeExports', () => {
  beforeEach(() => {
    vol.reset()
  })

  it('should throw for an empty file', async () => {
    await fs.writeFile(filename, '')
    const file = await fs.open(filename, 'r+')
    await assert.rejects(async () => await removeExports(file as any), {
      message: "Couldn't find export statement"
    })
    await file.close()
  })

  it('should throw for a file w/out export', async () => {
    await fs.writeFile(filename, longFile)
    const file = await fs.open(filename, 'r+')
    await assert.rejects(async () => await removeExports(file as any), {
      message: "Couldn't find export statement"
    })
    await file.close()
  })

  it('should throw for a file w/out export and semi colons', async () => {
    await fs.writeFile(filename, longFile.concat(';some statement;\n\r'))
    const file = await fs.open(filename, 'r+')
    await assert.rejects(async () => await removeExports(file as any), {
      message: "Last statement didn't contain the word export"
    })
    await file.close()
  })

  it('should throw for a file with export but no semi colon', async () => {
    await fs.writeFile(filename, longFile.concat('export;\n\r'))
    const file = await fs.open(filename, 'r+')
    await assert.rejects(async () => await removeExports(file as any), {
      message: "Couldn't find export statement"
    })
    await file.close()
  })

  it('should remove the export statement', async () => {
    await fs.writeFile(filename, longFile.concat(';export;\n\r'))
    const file = await fs.open(filename, 'r+')
    await removeExports(file as any)
    await file.close()
    assert.equal(`${longFile};`, await fs.readFile(filename, 'utf-8'))
  })

  it('should remove the export statement with exports', async () => {
    await fs.writeFile(
      filename,
      longFile.concat(
        ';export {default as SomeReallyLongNameThatMightSpillOver};\n\r'
      )
    )
    const file = await fs.open(filename, 'r+')
    await removeExports(file as any)
    await file.close()
    assert.equal(`${longFile};`, await fs.readFile(filename, 'utf-8'))
  })

  it('should remove the export with exports just over the chunk', async () => {
    await fs.writeFile(
      filename,
      // This export is 42 characters (bytes) which means the export text
      // should be split into two chunks
      longFile.concat(';export {default as SomeReallyLongNameHere};\n\r')
    )
    const file = await fs.open(filename, 'r+')
    await removeExports(file as any, 40)
    await file.close()
    assert.equal(`${longFile};`, await fs.readFile(filename, 'utf-8'))
  })
})
