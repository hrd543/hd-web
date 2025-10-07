// TODO fix this once image test reimplemented

declare module '*.png' {
  const value: string
  export = value
}

declare module '*.jpg' {
  const value: string
  export = value
}

declare module '*.webp' {
  const value: string
  export = value
}

// Test file extension - not actually used.
declare module '*.hd' {
  const value: string
  export = value
}
