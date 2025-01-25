/**
 * Reset and initialise all interactivity scripts within the site
 */
export const initialiseInteractions = () => {
  globalThis._hdWeb = {
    interactions: [],
    currentPage: ''
  }
}

/**
 * In order to make it compatible with the location api, replace
 * any \ with / and add a leading / if not present.
 */
const formatPage = (page: string) => {
  // replace \ with /
  const pageForwardSlash = page.replaceAll('\\', '/')

  if (pageForwardSlash.startsWith('/')) {
    return pageForwardSlash
  }

  return `/${pageForwardSlash}`
}

/**
 * Update the current page for defining interactions.
 */
export const updateInteractionsPage = (page: string) => {
  globalThis._hdWeb.currentPage = formatPage(page)
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

// exported for testing
export const addInteraction = (name: string, args: any, id: number) => {
  globalThis._hdWeb.interactions.push({
    name,
    args,
    id,
    page: globalThis._hdWeb.currentPage
  })
}

/**
 * Get a new id for use in the interact function. Just use the current number
 * of interactions.
 */
const getNewId = () => globalThis._hdWeb.interactions.length

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
const getInteractions = () => globalThis._hdWeb.interactions

type InternalInteractionArgs = {
  name: string
  args: any
  id: number
  page: string
}

const defineSingleInteraction = ({
  name,
  id,
  args
}: InternalInteractionArgs) => {
  return `${name}(${id}, ${JSON.stringify(args)});`
}

/**
 * Take the interactive scripts, and their args, and create a js snippet
 * to be run on the client which will call each callback.
 *
 * Only run the callback if we're on the page in which it was meant to be run.
 */
export const defineInteractions = () => {
  const interactions = getInteractions()

  if (interactions.length === 0) {
    return ''
  }

  const interactionsByPage = interactions.reduce(
    (all, interaction) => {
      if (all[interaction.page]) {
        all[interaction.page]!.push(interaction)
      } else {
        all[interaction.page] = [interaction]
      }

      return all
    },
    {} as Record<string, InternalInteractionArgs[]>
  )

  // Use a switch statement to check if the path matches our current page
  let js = `switch(window.location.pathname) {`

  // Loop through each page and add specific case statements.
  for (const page in interactionsByPage) {
    const interactionString = interactionsByPage[page]!.map((int) =>
      defineSingleInteraction(int)
    ).join('')

    js += `case "${page}": {${interactionString}break}`
  }

  // close the switch statement
  return js + '}'
}

// Using the global object since this gets bundled and used when
// building the components, so any variables here won't nec.
// be the same.
declare namespace globalThis {
  let _hdWeb: {
    interactions: InternalInteractionArgs[]
    currentPage: string
  }
}
