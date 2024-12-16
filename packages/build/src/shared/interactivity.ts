/**
 * Reset and initialise all interactivity scripts within the site
 */
export const initialiseInteractions = () => {
  globalThis._hdInteractions = []
}

/**
 * Register the callback to be run with args on the client.
 * Also provides you with a unique id to use for selecting instances
 * of components.
 *
 * NB the callback must be defined outside the scope of the component.
 */
export const interact = <T>(
  callback: (id: number, args: T) => void,
  args: T
) => {
  const name = callback.name

  if (!name || name === 'anonymous') {
    throw new Error(
      'Please pass a function defined outside the scope of your component'
    )
  }

  const id = globalThis._hdInteractions.length

  globalThis._hdInteractions.push({ name, args, id })

  return id
}

/**
 * Get the current interactive callbacks which have been registered
 */
export const getInteractions = () => globalThis._hdInteractions

/**
 * Take the interactive scripts, and their args, and create a js snippet
 * to be run on the client which will call each callback.
 */
export const defineInteractions = () => {
  const callbacks = getInteractions()

  return callbacks.reduce((js, { name, args, id }) => {
    return js + `${name}(${id}, ${JSON.stringify(args)});`
  }, '')
}

// Using the global object since this gets bundled and used when
// building the components, so any variables here won't nec.
// be the same.
declare namespace globalThis {
  let _hdInteractions: Array<{
    name: string
    args: any
    id: number
  }>
}
