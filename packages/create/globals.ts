export const initialiseGlobals = () => {
  const elements: Record<string, string> = {}
  // @ts-ignore
  globalThis.HTMLElement = class {}
  // @ts-ignore
  globalThis.customElements = {
    get: (key: string) => elements[key],
    define: (name, constructor) => {
      elements[name] = constructor.name
    },
    // below only used internally. Use element.name to get the name of the variable
    // for use in customElements.define later on
    // @ts-ignore
    getAll: () => elements
  }
}
