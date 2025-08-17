import assert from 'assert/strict'
import { describe, it } from 'node:test'
import { stringifyAttribute, stringifyStyle } from './stringifyAttributes.js'

describe('stringifyAttribute', () => {
  it('should stringify strings', () => {
    assert.equal(stringifyAttribute('a', 'bc'), ' a="bc"')
  })

  it('should stringify numbers', () => {
    assert.equal(stringifyAttribute('a', '23'), ' a="23"')
  })

  it('should stringify booleans', () => {
    assert.equal(stringifyAttribute('a', true), ' a')
    assert.equal(stringifyAttribute('a', false), '')
  })

  it('should stringify undefined', () => {
    assert.equal(stringifyAttribute('a', undefined), '')
  })

  it('should stringify urls', () => {
    assert.equal(stringifyAttribute('a', { href: 'hi' } as URL), ' a="hi"')
  })
})

describe('stringifyStyle', () => {
  it('should stringify an empty style', () => {
    assert.deepEqual(stringifyStyle({}), ' style=""')
  })

  it('should stringify undefined', () => {
    assert.deepEqual(stringifyStyle({ font: undefined }), ' style=""')
  })

  it('should stringify a string', () => {
    assert.deepEqual(stringifyStyle({ font: 'icon' }), ' style="font:icon;"')
  })

  it('should stringify a number', () => {
    assert.deepEqual(
      stringifyStyle({ 'aspect-ratio': 100 }),
      ' style="aspect-ratio:100;"'
    )
  })

  it('should stringify multiple', () => {
    assert.deepEqual(
      stringifyStyle({ font: 'icon', 'aspect-ratio': 100 }),
      ' style="font:icon;aspect-ratio:100;"'
    )
  })
})
