// By default we don't optimise webp images and assume they already have been
export const imageFileTypes = ['.jpg', '.jpeg', '.png']

export const buildFileTypeRegex = (fileTypes: string[]): RegExp => {
  const fileTypeOr = fileTypes.map((x) => x.slice(1)).join('|')

  return new RegExp(`\\.(${fileTypeOr})$`)
}
