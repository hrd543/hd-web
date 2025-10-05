import type { BuildFailure } from 'esbuild'

export const isEsbuildError = (e: unknown): e is BuildFailure =>
  e instanceof Error &&
  'errors' in e &&
  Array.isArray(e.errors) &&
  e.errors.length > 0
