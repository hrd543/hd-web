/**
 * Use this prop with a unique id in order to get a reference
 * to it using getContainerElement.
 */
export const hdIdProp = 'data-hd-id'

/**
 * Get the container which has the unique id attached to it,
 * and throw an error if the id has not been attached to the element.
 *
 * Make sure to attach the id as well!
 */
export const getContainerElement = (id: number, name?: string) => {
  const container = document.querySelector(`[${hdIdProp}="${id}"]`)

  if (!container) {
    throw new Error(`
      Couldn't find "${name ?? 'container'}" with id "${id}".
      Did you forget to add ${hdIdProp} to it?
      `)
  }

  return container
}
