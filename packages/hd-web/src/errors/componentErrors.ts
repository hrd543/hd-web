export const componentErrors = {
  'comp.defaultExport': (message: string) =>
    `${message}\nClient classes must be the default export`,
  'comp.notFound': (key: string, filename: string) =>
    `Component with key "${key}" not found at file "${filename}"`,
  'comp.filename': (key: string) =>
    `No components with key "${key}" were found.\nDid you forget to end the filename with .client.ts?`,
  'comp.oneChild': (key: string) =>
    `Components with client js must only have one child.\nComponent with key "${key}" had multiple`,
  'comp.intrinsicChild': (key: string) =>
    `Components with client js must have an intrinsic child like a div.\nComponent with key "${key}" did not`,
  'comp.unique': (key: string) =>
    `Components must have unique keys.\nFound multiple with key "${key}"`,
  'comp.missingListener': (key: string, listener: string) =>
    `Couldn't find the method "${listener}" on component "${key}"`,
  // TODO improve this error message to give more context
  'comp.parent': () =>
    "You can't specify listeners without a parent component.\nDid you forget to registerClient()?"
}
