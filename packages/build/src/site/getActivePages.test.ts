import { beforeEach, describe, it, mock } from 'node:test'
import { vol } from 'memfs'
import fsNode from 'fs/promises'
import assert from 'assert/strict'
import { getActivePages } from './getActivePages.js'

const fs = vol.promises
const structure = () => ({
  src: {
    contact: {
      'index.tsx': '',
      'index.js': '',
      'hello.txt': ''
    },
    about: {
      'hello.tsc': ''
    },
    'index.tsx': '',
    'hello.tsx': ''
  },
  dist: {
    hello: {
      'hello.css': ''
    },
    'hi.css': ''
  }
})

mock.method(fsNode, 'readdir', fs.readdir)

describe('getActivePages', () => {
  beforeEach(() => {
    vol.reset()
  })

  it('should return empty if no files', async () => {
    vol.fromNestedJSON(structure())
    assert.deepEqual(await getActivePages('dist', 'index.tsx'), [])
  })

  it("should throw if the directory doesn't exist", () => {
    vol.fromNestedJSON(structure())
    assert.rejects(() => getActivePages('newFolder', 'index.tsx'))
  })

  it('should return all page files', async () => {
    vol.fromNestedJSON(structure())
    assert.deepEqual(await getActivePages('src', 'index.tsx'), ['contact', ''])
    assert.deepEqual(await getActivePages('src', 'hello.tsc'), ['about'])
  })

  it('should consider file extension', async () => {
    vol.fromNestedJSON(structure())
    assert.deepEqual(await getActivePages('src', 'hello.tsx'), [''])
  })

  it('should return the relative path', async () => {
    vol.fromNestedJSON(structure())
    assert.deepEqual(await getActivePages('src/contact', 'index.tsx'), [''])
  })

  it('should ignore folders', async () => {
    vol.fromNestedJSON({ ...structure(), 'index.tsx': { 'hello.tsx': '' } })
    assert.deepEqual(await getActivePages('src', 'index.tsx'), ['contact', ''])
  })
})
