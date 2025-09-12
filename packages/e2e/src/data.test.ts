import { describe, it } from 'node:test'

import assert from 'assert/strict'
import * as cheerio from 'cheerio'
import { build } from 'hd-web'

import { getFileByPath } from './utils/getFileByPath.js'

describe('Subpages', async () => {
  const built = (await build({
    write: false,
    entry: 'src/sites/data.tsx',
    out: 'out',
    joinTitles: false
  }))!

  const fileByPath = getFileByPath(built)

  // console.log(fileByPath)

  const root = cheerio.load(fileByPath['index.html']?.contents ?? '')
  const one = cheerio.load(fileByPath['0.html']?.contents ?? '')
  const two = cheerio.load(fileByPath['1.html']?.contents ?? '')

  it('should create all the routes properly', () => {
    assert.ok(fileByPath['index.html'])
    assert.ok(fileByPath['0.html'])
    assert.ok(fileByPath['1.html'])
    assert.ok(fileByPath['2.html'])
    assert.ok(fileByPath['3.html'])
    assert.ok(fileByPath['4.html'])
  })

  it('should have the correct content in the root', () => {
    assert.equal(root('#content').text(), '5')
  })

  it('should have the correct content in the children', () => {
    assert.equal(one('#5').text(), 'Content')
    assert.equal(two('#4').text(), 'Content')
  })

  it('should have the correct title in each child', () => {
    assert.equal(one('head').text(), 'Item 5')
    assert.equal(two('head').text(), 'Item 4')
  })
})
