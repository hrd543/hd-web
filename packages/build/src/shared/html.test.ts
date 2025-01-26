import assert from 'assert/strict'
import { describe, it } from 'node:test'
import { buildHtml } from './html.js'

describe('html', () => {
  describe('buildHtml', () => {
    it('should correctly add all elements to the html', () => {
      assert.equal(
        buildHtml(
          {
            title: 'henry',
            description: 'my new site',
            body: 'body',
            head: 'head'
          },
          ['main.js'],
          ['index.css']
        ),
        '<!DOCTYPE html><html><head><title>henry</title><meta name="description" content="my new site" />head<script type="module" src="/main.js"></script><link rel="stylesheet" href="/index.css" /></head><body>body</body></html>'
      )
    })

    it('should leave out an empty description', () => {
      assert.equal(
        buildHtml(
          {
            title: 'henry',
            body: 'body',
            head: 'head'
          },
          ['main.js'],
          ['index.css']
        ),
        '<!DOCTYPE html><html><head><title>henry</title>head<script type="module" src="/main.js"></script><link rel="stylesheet" href="/index.css" /></head><body>body</body></html>'
      )
    })
  })
})
