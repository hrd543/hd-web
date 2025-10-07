import { HdNode, View } from 'hd-web'

export type MarkdownProps = {
  /** The markdown content to be rendered into html */
  md: string
  /** The function for converting the md into html */
  parse: (md: string) => HdNode
}

/**
 * A component for rendering markdown strings into html
 */
export const Markdown: View<MarkdownProps> = ({ parse, md }) => {
  return parse(md)
}
