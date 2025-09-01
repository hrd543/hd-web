import path from 'node:path'
import { describe, it } from 'node:test'

import assert from 'assert/strict'
import * as cheerio from 'cheerio'
import { build } from 'hd-web'

import { assertArrayEqual } from './utils/arrayEqual.js'

describe('General build', async () => {
  const built = (await build({
    write: false,
    entry: 'sites/singlePage.tsx',
    out: 'out'
  }))!

  const $ = cheerio.load(
    built.find((f) => f.relativePath === 'index.html')!.contents!
  )

  it('should create necessary files on build', () => {
    assertArrayEqual(
      built.map((file) => file.relativePath),
      ['index.html', 'singlePage.js']
    )
  })

  it('should have them in the out folder', () => {
    assert.ok(built.every((f) => path.basename(path.dirname(f.path)) === 'out'))
  })

  it('should render the body correctly', () => {
    assert.equal($('#content').text(), 'Single page site body')
  })

  it('should render the head correctly', () => {
    const head = $('#head')
    assert.equal(head.attr('name'), 'test')
  })

  it('should include one script element for the js', () => {
    const scripts = $('script')

    assert.ok(
      scripts.length === 1 && scripts[0]!.attribs.src === '/singlePage.js'
    )
  })
})
