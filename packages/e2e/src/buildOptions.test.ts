import { describe, it } from 'node:test'

import assert from 'assert/strict'
import * as cheerio from 'cheerio'
import { build, HdBuildConfig } from 'hd-web'

import { getFileByPath } from './utils/getFileByPath.js'

describe('Build options', () => {
  it('should join titles if true', async () => {
    const fileByPath = await buildHelper({
      joinTitles: true,
      entry: 'src/sites/routes.tsx'
    })

    assert.equal(
      cheerio.load(fileByPath['child/leaf.html']!.contents!)('title').text(),
      'leaf | child | Root'
    )
  })

  it('should not join titles if false', async () => {
    const fileByPath = await buildHelper({
      joinTitles: false,
      entry: 'src/sites/routes.tsx'
    })

    assert.equal(
      cheerio.load(fileByPath['child/leaf.html']!.contents!)('title').text(),
      'leaf'
    )
  })

  it('should set the language correctly', async () => {
    const fileByPath = await buildHelper({ lang: 'LANGUAGE' })

    assert.equal(
      cheerio.load(fileByPath['index.html']!.contents!)('html').attr('lang'),
      'LANGUAGE'
    )
  })

  it('should copy the static folder if used', async () => {
    const fileByPath = await buildHelper({
      staticFolder: 'src/staticFolder'
    })

    assert.ok(fileByPath['favicon.ico'])
    assert.ok(fileByPath['random.json'])
    assert.ok(fileByPath['robots.txt'])
  })
})

const buildHelper = async (options: Partial<HdBuildConfig>) =>
  getFileByPath(
    (await build({
      write: false,
      entry: 'src/sites/singlePage.tsx',
      out: 'out',
      ...options
    }))!
  )
