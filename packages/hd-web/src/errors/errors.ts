import { componentErrors } from './componentErrors.js'
import { filsystemErrors } from './filesystemErrors.js'

export const errors = {
  ...componentErrors,
  ...filsystemErrors
} as const

export type HdErrors = typeof errors
export type HdErrorKey = keyof HdErrors
