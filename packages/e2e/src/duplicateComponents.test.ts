import { describe, it } from 'node:test'

import assert from 'assert/strict'
import { build } from 'hd-web'

describe('Duplicate components', async () => {
  it('should throw an error when building', () => {
    assert.rejects(
      build({
        write: false,
        entry: 'src/sites/duplicateComponents.tsx',
        out: 'out'
      }),
      /The key "_componentKey" is used by multiple client components/
    )
  })
})
