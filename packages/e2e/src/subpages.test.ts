import { describe, it } from 'node:test'

import assert from 'assert/strict'
import * as cheerio from 'cheerio'
import { build } from 'hd-web'

import { getFileByPath } from './utils/getFileByPath.js'

describe('Subpages', async () => {
  const built = (await build({
    write: false,
    entry: 'src/sites/routes.tsx',
    out: 'out'
  }))!

  const fileByPath = getFileByPath(built)

  const root = cheerio.load(fileByPath['index.html']?.contents ?? '')
  const leaf1 = cheerio.load(fileByPath['leaf.html']?.contents ?? '')
  const child = cheerio.load(fileByPath['child/index.html']?.contents ?? '')
  const leaf2 = cheerio.load(fileByPath['child/leaf.html']?.contents ?? '')
  const grandchild = cheerio.load(
    fileByPath['child/grandchild.html']?.contents ?? ''
  )

  it('should create all the routes properly', () => {
    assert.ok(fileByPath['index.html'])
    assert.ok(fileByPath['leaf.html'])
    assert.ok(fileByPath['child/index.html'])
    assert.ok(fileByPath['child/leaf.html'])
    assert.ok(fileByPath['child/grandchild.html'])
  })

  it('should have the correct content in each page', () => {
    assert.ok(root('#root').children().length)
    assert.equal(leaf1('#leaf').text(), 'Leaf')
    assert.equal(child('#child').text(), 'Child')
    assert.equal(leaf2('#leaf2').text(), 'Leaf 2')
    assert.equal(grandchild('#grandchild').text(), 'Grandchild')
  })

  it('should have the correct head for each page', () => {
    assert.equal(root('#head-root').attr('name'), 'test')
    assert.equal(leaf1('#head-root').attr('name'), 'test')
    assert.equal(child('#head-child').attr('name'), 'test')
    assert.equal(leaf2('#head-root').attr('name'), 'test')
    assert.equal(grandchild('#head-grandchild').attr('name'), 'test')
  })

  it('should have the script attached to each subpage', () => {
    assert.ok(
      [root, leaf1, child, leaf2, grandchild].every(
        (page) => page('script')[0]!.attribs.src === '/routes.js'
      )
    )
  })
})
