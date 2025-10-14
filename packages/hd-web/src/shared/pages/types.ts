import { AsyncView } from '@hd-web/jsx'

export type PageStack<T> = [path: string, page: Page<T, any>, title: string]

export type PageContent<SiteData = unknown, PageData = any> = AsyncView<{
  siteData: SiteData
  pageData: PageData
}>

/**
 * The return type of the SubPage function.
 */
export type Page<SiteData = unknown, PageData = undefined> = {
  title: string | ((pageData: PageData) => string)
  description?: string | ((pageData: PageData) => string)
  content: PageContent<SiteData, PageData>
  head?: PageContent<SiteData, PageData>
  routes?:
    | Record<string, Page<SiteData, any>>
    | ((data: SiteData) => Record<string, Page<SiteData, any>>)
} & (PageData extends undefined
  ? {
      getPageData?: undefined
    }
  : {
      getPageData: (data: SiteData, path: string[]) => PageData
    })

/**
 * The return type of the SiteFunction.
 */
export type Site<Data = undefined> = {
  root: Page<Data, any>
  head: PageContent<Data>
} & (Data extends undefined
  ? { getSiteData?: undefined }
  : { getSiteData: () => Promise<Data> | Data })

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
export type BuiltPage<T = unknown> = [
  path: string,
  content: {
    title: string
    description?: string
    content: PageContent<T>
    head?: PageContent<T>
    pageData: any
  },
  hasChildren: boolean
]

export type BuiltSite<T = unknown> = {
  data: T
  head: PageContent<T>
  pages: Array<BuiltPage<T>>
}
