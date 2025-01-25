import { describe, it, beforeEach } from 'node:test'
import assert from 'assert/strict'
import {
  addInteraction,
  defineInteractions,
  initialiseInteractions,
  updateInteractionsPage
} from './interactivity.js'

describe('interactions', () => {
  describe('defineInteractions', () => {
    beforeEach(() => {
      initialiseInteractions()
    })

    it('should return empty if no interactions', () => {
      assert.equal(defineInteractions(), '')
    })

    it('should work with single page', () => {
      addInteraction('a', { b: 1 }, 0)
      // addInteraction('c', { d: 1 }, 1)

      assert.equal(
        defineInteractions().trim(),
        'switch(window.location.pathname) {case "": {a(0, {"b":1});break}}'
      )
    })

    it('should work with multiple pages', () => {
      addInteraction('a', { b: 1 }, 0)
      updateInteractionsPage('about')
      addInteraction('c', { d: 1 }, 1)

      assert.equal(
        defineInteractions().trim(),
        'switch(window.location.pathname) {case "": {a(0, {"b":1});break}case "/about": {c(1, {"d":1});break}}'
      )
    })
  })
})
