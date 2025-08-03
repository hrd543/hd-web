import assert from 'assert/strict'
import { describe, it } from 'node:test'
import { addMetaToHead } from './site/html.js'

describe('html', () => {
  describe('addMetaToHead', () => {
    it('should correctly add all elements to the head', () => {
      assert.equal(
        addMetaToHead(
          <>head</>,
          'henry',
          'my new site',
          ['main.js'],
          ['index.css']
        ),
        '<head><title>henry</title><meta name="description" content="my new site" />head<script type="module" src="/main.js"></script><link rel="stylesheet" href="/index.css" /></head>'
      )
    })

    it('should leave out an empty description', () => {
      assert.equal(
        addMetaToHead(
          <>head</>,
          'henry',
          undefined,
          ['main.js'],
          ['index.css']
        ),
        '<head><title>henry</title>head<script type="module" src="/main.js"></script><link rel="stylesheet" href="/index.css" /></head>'
      )
    })
  })
})
