export const componentErrors = {
  'comp.defaultExport': (message: string) =>
    `${message}\nClient classes must be the default export`,
  'comp.filename': (key: string) =>
    `No components with key "${key}" were found.\nDid you forget to end the filename with .client.ts?`,
  'comp.oneChild': (key: string) =>
    `Components with client js must only have one child.\nComponent with key "${key}" had multiple`,
  'comp.intrinsicChild': (key: string) =>
    `Components with client js must have an intrinsic child like a div.\nComponent with key "${key}" did not`,
  'comp.unique': (key: string) =>
    `Components must have unique keys.\nFound multiple with key "${key}"`
}
