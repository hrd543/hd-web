import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import rehypeReact, { Options } from 'rehype-react'
import { HdElement } from 'hd-web'
import { Fragment, jsx, jsxDEV, jsxs, View } from '@hd-web/jsx'
import { Markdown as MarkdownRaw } from '@hd-web/markdown'
import { getMdComponents } from './components.js'
import { MarkdownOptions } from './types.js'

export const initialise = (options: MarkdownOptions) => {
  if (!globalThis._hdMd) {
    globalThis._hdMd = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeReact, {
        Fragment,
        jsx,
        jsxDEV,
        jsxs,
        components: getMdComponents(options),
        stylePropertyNameCase: 'css',
        elementAttributeNameCase: 'html'
      } as Options)
  }
}

export const parse = (markdown: string): HdElement => {
  if (!globalThis._hdMd) {
    throw new Error(
      'Markdown has not been initialised. Did you forget to attach the plugin?'
    )
  }

  return globalThis._hdMd.processSync(markdown).result
}

export type MarkdownProps = {
  md: string
}

export const Markdown: View<MarkdownProps> = ({ md }) => {
  return <MarkdownRaw md={md} parse={parse} />
}
