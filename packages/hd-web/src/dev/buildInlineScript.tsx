import { HdNode } from '@hd-web/jsx'

const placeholder = '%%hd-web%%'

export const buildEmptyScript = (): HdNode => (
  <script type="module">{placeholder}</script>
)

export const addJsToEmptyScript = (html: string, js: string) => {
  return html.replaceAll(placeholder, js)
}
