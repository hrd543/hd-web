export const componentErrors = {
  'comp.defaultExport': (message: string) =>
    `${message}\nClient classes must be the default export`,
  'comp.filename': (key: string) =>
    `No components with key "${key}" were found.\nDid you forget to end the filename with .client.ts?`
}
