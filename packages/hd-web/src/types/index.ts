import { HdNode } from '@hd-web/jsx'

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
  body: () => HdNode
  head: () => HdNode
  /**w
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
