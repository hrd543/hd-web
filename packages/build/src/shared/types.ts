/** The return type of the Page function */
export type PageReturn =
  | {
      body: string
      routes?: Record<string, Page>
    }
  | string

/**
 * An hd-web equivalent of a functional component.
 * Should return the html content of a page and any sub
 * routes.
 */
export type Page = () => PageReturn | Promise<PageReturn>

/**
 * Only to be used internally.
 *
 * Contains the path and contents of a single page.
 */
export type BuiltPage = [path: string, content: string]
