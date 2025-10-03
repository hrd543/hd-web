import { Page } from 'hd-web'
import content, { meta } from './blog.md'
import { Markdown } from '@hd-web/md-content'

export const MarkdownPage: Page = {
  title: meta.title,
  content: () => <Markdown md={content} />
}
