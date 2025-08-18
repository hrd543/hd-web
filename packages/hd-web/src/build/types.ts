import { HdNode } from '@hd-web/jsx'

export type BuiltFile = {
  path: string
  relativePath: string
  type: 'css' | 'js' | 'file'
}

/**
 * Only to be used internally.
 *
 * Contains the path and contents of a single page, as well
 * as whether the page needs a new folder or just a file.
 *
 * For example, if a page doesn't have any subroutes, it can
 * be made into a `name.html` file rather than `index.html`
 * within a name folder.
 */
export type BuiltPage = [
  path: string,
  content: {
    head: () => HdNode
    title: string
    description?: string
    body: () => HdNode
  },
  hasChildren: boolean
]
