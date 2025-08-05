import { BaseProps } from '../../types.js'

export const convertPropsToClient = <T extends BaseProps>(
  props?: T | null
): string | null => {
  if (!props) {
    return null
  }

  const newProps: Record<string, unknown> = {}

  for (const key in props) {
    if (key.startsWith('_') && props[key] !== undefined) {
      newProps[key] = props[key]
    }
  }

  return Object.keys(newProps).length ? JSON.stringify(newProps) : null
}
