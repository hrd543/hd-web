import { filsystemErrors } from './filesystemErrors.js'

export const errors = {
  ...filsystemErrors
} as const

export type HdErrors = typeof errors
export type HdErrorKey = keyof HdErrors
