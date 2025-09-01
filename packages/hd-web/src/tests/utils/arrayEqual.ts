import assert from 'node:assert'

export const arrayEqual = <T>(a: T[], b: T[]) =>
  a.length === b.length && a.every((aEntry) => b.includes(aEntry))

export const assertArrayEqual = <T>(a: T[], b: T[]) =>
  assert.equal(
    true,
    arrayEqual(a, b),
    `
  Expected: ${a}
  Received: ${b}
`
  )
