/**
 * Create definitions for every custom element used
 */
export const defineCustomElements = (
  getCustomElements: () => Record<string, string>
) => {
  const customEls = getCustomElements()
  let customElsDefinition = ''

  for (const element in customEls) {
    customElsDefinition += `customElements.define("${element}", ${customEls[element]});`
  }

  return customElsDefinition
}

/*
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

declare namespace globalThis {
  class HTMLElement {}

  interface CustomElementRegistry {
    get: (name: string) => string | undefined
    define: (name: string, constructor: () => void) => void
  }

  let customElements: CustomElementRegistry
}
