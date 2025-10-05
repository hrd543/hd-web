import { componentErrors } from './componentErrors.js'
import { filsystemErrors } from './filesystemErrors.js'
import { siteErrors } from './siteErrors.js'

export const errors = {
  ...componentErrors,
  ...filsystemErrors,
  ...siteErrors
} as const

export type HdErrors = typeof errors
export type HdErrorKey = keyof HdErrors
