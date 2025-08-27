const invalidChars = /[<>:"|?*£]/g

export const validatePath = (path: string) => !invalidChars.test(path)

/**
 * Removes all invalid characters from a path.
 *
 * Optionally replace all whitespace with a "-" character, and make sure
 * there's only one at most in a row.
 */
export const cleanPath = (path: string, whitespace = false) => {
  const cleaned = path.replaceAll(invalidChars, '')

  if (!whitespace) {
    return cleaned
  }

  return cleaned.replaceAll('-', ' ').replaceAll(/\s+/g, '-')
}
