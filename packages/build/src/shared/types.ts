import { type JSX } from '@hd-web/jsx'

/**
 * The return type of the SubPage function.
 */
export type SubPage = Partial<Site> & Pick<Site, 'body' | 'title'>

/**
 * A subpage of your site.
 *
 * Contains information about each page with optional entries
 * overwritten by the main Site function.
 */
export type SubPageFunction = () => SubPage | Promise<SubPage>

/**
 * The return type of the SiteFunction.
 */
export type Site = {
  title: string
  description?: string
  body: JSX.Element
  head: JSX.Element
  /**
   * Specify the subpages of this particular page.
   */
  routes?: Record<string, SubPageFunction>
}

/**
 * The entry point for your hd-web app.
 *
 * Provides information about the content, metadata and subpages
 * contained within the site.
 */
export type SiteFunction = () => Site | Promise<Site>

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
    head: string
    body: string
    components: Map<string, string>
  },
  hasChildren: boolean
]
