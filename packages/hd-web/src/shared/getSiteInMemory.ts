// Assumes esm format with the site as the default export
export const getSiteInMemory = async (js: string) => {
  // TODO find a better way of doing this.
  // It's hard because it imports "node:path" etc
  const base64 = Buffer.from(js, 'utf-8').toString('base64')
  return (await import(`data:text/javascript;base64,${base64}`)).default
}
