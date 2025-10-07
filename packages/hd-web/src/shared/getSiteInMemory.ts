// Assumes esm format with the site as the default export
export const getSiteInMemory = async (js: string) => {
  // TODO find a better way of doing this.
  // It's hard because it imports "node:path" etc
  return (await import(`data:text/javascript,${js}`)).default
}
