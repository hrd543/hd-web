import { describe, it } from 'node:test'
import assert from 'assert/strict'
import { validatePage } from './pages.js'

describe('validatePage', () => {
  it('should throw if page is not a function', () => {
    assert.rejects(() => validatePage('d', ''))
  })

  it('should return if page returns a string', async () => {
    assert.equal(await validatePage(() => 'hi', ''), 'hi')
  })

  it('should throw if page returns a non object', () => {
    assert.rejects(() => validatePage(() => 1, ''))
    assert.rejects(() => validatePage(() => true, ''))
    assert.rejects(() => validatePage(() => null, ''))
    assert.rejects(() => validatePage(() => undefined, ''))
  })

  it('should throw if body is not the right type', () => {
    assert.rejects(() => validatePage(() => ({ body: 1 }), ''))
    assert.rejects(() => validatePage(() => ({ body: true }), ''))
    assert.rejects(() => validatePage(() => ({ body: null }), ''))
    assert.rejects(() => validatePage(() => ({ body: undefined }), ''))
    assert.rejects(() => validatePage(() => ({}), ''))
  })

  it('should return the result if routes is not present', async () => {
    assert.deepEqual(await validatePage(() => ({ body: 'hi' }), ''), {
      body: 'hi'
    })
  })

  it('should throw if routes is not the right type', () => {
    assert.rejects(() => validatePage(() => ({ body: 'hi', routes: 1 }), ''))
    assert.rejects(() => validatePage(() => ({ body: 'hi', routes: true }), ''))
    assert.rejects(() => validatePage(() => ({ body: 'hi', routes: null }), ''))
    assert.rejects(() =>
      validatePage(() => ({ body: 'hi', routes: undefined }), '')
    )
  })

  it('should return if routes is present and correct', async () => {
    assert.deepEqual(
      await validatePage(() => ({ body: 'hi', routes: { a: '' } }), ''),
      { body: 'hi', routes: { a: '' } }
    )
  })
})
