import { describe, it } from 'node:test'

import assert from 'assert/strict'
import * as cheerio from 'cheerio'
import { build } from 'hd-web'

import { getFileByPath } from './utils/getFileByPath.js'

describe('Styles', async () => {
  const built = (await build({
    write: false,
    entry: 'src/sites/style.tsx',
    out: 'out'
  }))!
  const files = getFileByPath(built)

  it('should create a bundled css file', () => {
    assert.ok(files['style.css'])
  })

  it('should contain the minified styles', () => {
    const content = files['style.css']!.contents!
    assert.ok(content.includes('.one{display:flex}'))
    assert.ok(content.includes('.two{color:#fff}'))
  })

  it('should be included in the html', () => {
    const $ = cheerio.load(files['index.html']!.contents!)
    const links = $('link')
    assert.ok(
      links.length === 1 &&
        links[0]!.attribs.rel === 'stylesheet' &&
        links[0]!.attribs.href === '/style.css'
    )
  })
})
