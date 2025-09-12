import { describe, it } from 'node:test'

import { build } from 'hd-web'

import { assertError } from './utils/assertError.js'

describe('Duplicate components', async () => {
  it('should throw an error when building', async () => {
    await assertError(
      build({
        write: false,
        entry: 'src/sites/duplicateComponents.tsx',
        out: 'out'
      }),
      'comp.unique'
    )
  })
})
