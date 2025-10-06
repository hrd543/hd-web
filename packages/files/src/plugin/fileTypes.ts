export const buildFileTypeRegex = (fileTypes: string[]): RegExp => {
  const fileTypeOr = fileTypes.map((x) => x.slice(1)).join('|')

  return new RegExp(`\\.(${fileTypeOr})$`)
}
