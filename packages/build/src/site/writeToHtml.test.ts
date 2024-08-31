import assert from 'assert/strict'
import { describe, it } from 'node:test'
import { replaceHtml } from './writeToHtml.js'

const hdWeb = (str: string) => `%hd-web-${str}%`

describe('replaceHtml', () => {
  it('should return the string if empty object', () => {
    const test = 'hello'
    assert.equal(test, replaceHtml(test, {}))
  })

  it('should replace one instance of hd-web', () => {
    const test = `hello there ${hdWeb('henry')}`
    assert.equal(
      'hello there Mr Henry',
      replaceHtml(test, {
        henry: 'Mr Henry'
      })
    )
  })

  it('should replace multiple instances of hd-web', () => {
    it('should replace one instance of hd-web', () => {
      const test = `hello there ${hdWeb('henry')}, aged ${hdWeb('age')}`
      assert.equal(
        'hello there Mr Henry, aged 25',
        replaceHtml(test, {
          henry: 'Mr Henry',
          age: '25'
        })
      )
    })
  })

  it('should throw if no occurence of replacement in string', () => {
    const test = `hello there`
    assert.throws(() => replaceHtml(test, { henry: 'Henry' }))
  })

  it('should throw if multiple occurences of replacement', () => {
    const test = `hello there ${hdWeb('henry')} ${hdWeb('henry')}`
    assert.throws(() => replaceHtml(test, { henry: 'henry' }))
  })
})
