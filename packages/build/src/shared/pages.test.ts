import { describe, it } from 'node:test'
import assert from 'assert/strict'
import { validatePage } from './pages.js'

describe('validatePage', () => {
  it('should throw if page is not a function', () => {
    assert.rejects(() => validatePage('d', ''))
  })

  it('should throw if page returns a non object', () => {
    assert.rejects(() => validatePage(() => 1, ''))
    assert.rejects(() => validatePage(() => 'j', ''))
    assert.rejects(() => validatePage(() => true, ''))
    assert.rejects(() => validatePage(() => null, ''))
    assert.rejects(() => validatePage(() => undefined, ''))
  })

  it('should throw if body is not the right type', () => {
    assert.rejects(() => validatePage(() => ({ title: 'a', body: 1 }), 'a'))
    assert.rejects(() => validatePage(() => ({ title: 'a', body: true }), 'a'))
    assert.rejects(() => validatePage(() => ({ title: 'a', body: null }), 'a'))
    assert.rejects(() =>
      validatePage(() => ({ title: 'a', body: undefined }), 'a')
    )
    assert.rejects(() => validatePage(() => ({ title: 'a' }), 'a'))
  })

  it('should throw if title is not the right type', () => {
    assert.rejects(() => validatePage(() => ({ body: 'a', title: 1 }), 'a'))
    assert.rejects(() => validatePage(() => ({ body: 'a', title: true }), 'a'))
    assert.rejects(() => validatePage(() => ({ body: 'a', title: null }), 'a'))
    assert.rejects(() =>
      validatePage(() => ({ body: 'a', title: undefined }), 'a')
    )
    assert.rejects(() => validatePage(() => ({ body: 'a' }), 'a'))
  })

  it("should throw if head is not present and it's the initial page", () => {
    assert.rejects(() => validatePage(() => ({ body: 'a', title: 'a' }), ''))
  })

  it("should not throw if head is not present but it's not the initial page", () => {
    assert.doesNotReject(() =>
      validatePage(() => ({ body: 'a', title: 'a' }), 'a')
    )
  })

  it('should return the result if routes is not present', async () => {
    assert.deepEqual(
      await validatePage(() => ({ body: 'hi', title: 'a', head: 'a' }), ''),
      {
        body: 'hi',
        title: 'a',
        head: 'a'
      }
    )
  })

  it('should throw if routes is not the right type', () => {
    assert.rejects(() =>
      validatePage(() => ({ body: 'hi', title: 'a', head: 'a', routes: 1 }), '')
    )
    assert.rejects(() =>
      validatePage(
        () => ({ body: 'hi', title: 'a', head: 'a', routes: true }),
        ''
      )
    )
    assert.rejects(() =>
      validatePage(
        () => ({ body: 'hi', title: 'a', head: 'a', routes: null }),
        ''
      )
    )
    assert.rejects(() =>
      validatePage(
        () => ({ body: 'hi', title: 'a', head: 'a', routes: undefined }),
        ''
      )
    )
  })

  it('should return if routes is present and correct', async () => {
    assert.deepEqual(
      await validatePage(
        () => ({ body: 'hi', title: 'a', head: 'a', routes: { a: '' } }),
        ''
      ),
      { body: 'hi', title: 'a', head: 'a', routes: { a: '' } }
    )
  })
})
