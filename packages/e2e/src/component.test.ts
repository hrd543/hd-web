import { describe, it } from 'node:test'
import vm from 'node:vm'

import assert from 'assert/strict'
import { Window } from 'happy-dom'
import { build } from 'hd-web'

import { getFileByPath } from './utils/getFileByPath.js'

describe('General build', async () => {
  let messages: any[] = []

  const window = new Window({
    console: {
      ...console,
      log: (m) => messages.push(m)
    }
  })
  const document = window.document
  vm.createContext(window)

  const built = (await build({
    write: false,
    entry: 'src/sites/components.tsx',
    out: 'out'
  }))!
  const files = getFileByPath(built)

  window.document.documentElement.innerHTML = files['index.html']!.contents!
  const js = files['components.js']!.contents!
  vm.runInContext(js, window)

  it('should run the component constructor for each instance', () => {
    assert.equal(messages.length, 2)
    assert.ok(messages[0] === messages[1] && messages[0] === 'running')
  })

  it('should only contain used components in the js', () => {
    assert.match(js, /_componentKey/)
    assert.doesNotMatch(js, /_unusedKey/)
  })

  it('should handle the listener on the root element', () => {
    messages = []

    const root = document.getElementById('component-1')!
    root.dispatchEvent(new window.Event('click'))
    assert.equal(messages.length, 1)
    assert.equal(messages[0], 'click')
  })

  it('should work with refs and custom events', () => {
    messages = []

    const root = document.getElementById('event-1')!
    root.dispatchEvent(new window.CustomEvent('newEvent'))
    assert.equal(messages.length, 1)
    assert.equal(messages[0], 'ref-1')
  })
})
