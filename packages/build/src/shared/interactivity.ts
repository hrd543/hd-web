/**
 * Reset and initialise all interactivity scripts within the site
 */
export const initialiseInteractions = () => {
  globalThis._hdInteractions = []
}

/**
 * A hook to be used within the `interact` function to add interactivity
 * to a component.
 */
export type InteractHook<T = undefined> = T extends undefined
  ? (id: number) => void
  : (id: number, args: T) => void

const getCallbackName = <T>(callback: InteractHook<T>) => {
  const name = callback.name

  if (!name || name === 'anonymous') {
    throw new Error(
      'Please pass a function defined outside the scope of your component'
    )
  }

  return name
}

const addInteraction = (name: string, args: any, id: number) => {
  globalThis._hdInteractions.push({ name, args, id })
}

/**
 * Get a new id for use in the interact function. Just use the current number
 * of interactions.
 */
const getNewId = () => globalThis._hdInteractions.length

/**
 * Register the hook to be run on the client with the given args.
 * Also provides you with a unique id to use for selecting instances
 * of components.
 *
 * Or you can pass in `idOverride` to pass that id into the hook instead
 * of this uniquely created one. This can be useful if using more than
 * one hook within a component.
 *
 * NB the hook must be defined outside the scope of the component.
 */
export function interact(
  hook: InteractHook<undefined>,
  args?: undefined,
  idOverride?: number
): number

export function interact<T>(
  hook: InteractHook<T>,
  args: T,
  idOverride?: number
): number

export function interact<T>(
  hook: InteractHook<T>,
  args: T,
  idOverride?: number
) {
  const id = idOverride ?? getNewId()
  addInteraction(getCallbackName(hook), args, id)

  return id
}

/**
 * Get the current interactive hooks which have been registered
 */
export const getInteractions = () => globalThis._hdInteractions

/**
 * Take the interactive scripts, and their args, and create a js snippet
 * to be run on the client which will call each callback.
 */
export const defineInteractions = () => {
  const interactions = getInteractions()

  return interactions.reduce((js, { name, args, id }) => {
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
