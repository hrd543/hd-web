/**
 * When building the html from the jsx, we need a few globals which aren't
 * defined when running in nodejs vs the browser.
 * In particular, we need some way of tracking which elements have been
 * registered so that we can add the define statements back in.
 * So we return a function which retrieves just that - the name of each
 * element and the name of it class
 */
export const initialiseGlobals = () => {
  const elements: Record<string, string> = {}
  globalThis.HTMLElement = class {}
  globalThis.customElements = {
    get: (key) => elements[key],
    define: (name, constructor) => {
      elements[name] = constructor.name
    }
  }

  return () => elements
}

declare module globalThis {
  class HTMLElement {}

  interface CustomElementRegistry {
    get: (name: string) => string | undefined
    define: (name: string, constructor: () => void) => void
  }

  var customElements: CustomElementRegistry
}
