import { FuncComponent } from '@hd-web/jsx'

export type PageStack<T> = [path: string, page: Page<T, any>, title: string]

type HtmlFunction<Data = unknown, Props = any> = FuncComponent<{
  data: Data
  props: Props
}>

/**
 * The return type of the SubPage function.
 */
export type Page<Data = unknown, Props = undefined> = {
  title: string | ((props: Props) => string)
  description?: string | ((props: Props) => string)
  content: HtmlFunction<Data, Props>
  head?: HtmlFunction<Data, Props>
  routes?:
    | Record<string, Page<Data, any>>
    | ((data: Data) => Record<string, Page<Data, any>>)
  // // maybe?
  // wrapper?: FuncComponent
} & (Props extends undefined
  ? {
      props?: undefined
    }
  : {
      props: (data: Data, path: string[]) => Props
    })

/**
 * The return type of the SiteFunction.
 */
export type Site<Data = undefined> = {
  root: Page<Data, any>
  head: HtmlFunction<Data>
} & (Data extends undefined
  ? { getData?: undefined }
  : { getData: () => Promise<Data> | Data })

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
    content: HtmlFunction<T>
    head?: HtmlFunction<T>
    props: any
  },
  hasChildren: boolean
]
