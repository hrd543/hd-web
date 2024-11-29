/** Generate a short random string for ids - not guaranteed to be unique */
export const generateId = (length = 6) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
}
