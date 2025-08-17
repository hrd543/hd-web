import { Element } from '../jsx/index.js'

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
    head: () => Element
    title: string
    description?: string
    body: () => Element
  },
  hasChildren: boolean
]

export type BuildSiteConfig = {
  /** Certain shortcuts can be taken if building for dev */
  dev: boolean
  /** The folder containing any static files, like a favicon */
  staticFolder?: string
  /** The language of your site, defaults to British English "en-GB" */
  lang: string
  /** Should the titles be joined */
  joinTitles: boolean
  /** The folder in which to place the built files */
  out: string
  /** The file which contains your App */
  entry: string
}
