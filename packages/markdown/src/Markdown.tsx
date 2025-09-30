import { View } from 'hd-web'

export type MarkdownProps = {
  /** The markdown content to be rendered into html */
  md: string
  /** The function for converting the md into html */
  parse: (md: string) => string
}

/**
 * A component for rendering markdown strings into html
 */
export const Markdown: View<MarkdownProps> = ({ parse, md }) => {
  return <>{parse(md)}</>
}
