export const getCssImports = (files: string[]) =>
  files.map((f) => `import "${f}";`).join()
