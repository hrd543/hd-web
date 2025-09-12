import { describe, it } from 'node:test'

import assert from 'assert/strict'
import { build } from 'hd-web'

describe('Duplicate components', async () => {
  it('should throw an error when building', () => {
    // TODO make error assertion easier in tests
    assert.rejects(
      build({
        write: false,
        entry: 'src/sites/duplicateComponents.tsx',
        out: 'out'
      }),
      /Found multiple with key "_componentKey"/
    )
  })
})
