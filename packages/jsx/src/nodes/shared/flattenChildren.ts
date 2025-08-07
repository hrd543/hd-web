import { Child, Children } from '../../types.js'

export const flattenChildren = (
  children: Children | undefined
): Child[] | undefined => {
  if (!children) {
    return
  }

  // @ts-expect-error Shouldn't happen in practice
  return [children].flat(Infinity)
}
