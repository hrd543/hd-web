export const isPage = (url: string) => {
  // NB html files will never have .html at the end due to above middleware.
  return !/\.[^./]+$/.test(url)
}
