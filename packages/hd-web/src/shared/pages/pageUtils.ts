import { HdNode } from '@hd-web/jsx'
import path from 'path'

import { BuiltPage, BuiltSite, PageStack } from './types.js'

export const getRoutes = <T>(
  currentPath: string,
  routesFn: PageStack<T>[1]['routes'],
  data: T,
  title: string
): Array<PageStack<T>> => {
  if (!routesFn) {
    return []
  }

  const routes = typeof routesFn === 'function' ? routesFn(data) : routesFn

  return Object.entries(routes).map<PageStack<T>>(([route, subPage]) => [
    path.posix.join(currentPath, route),
    subPage,
    title
  ])
}

type StrOrFn<T> = string | ((props: T) => string)

export function getStringOrFunction<T>(strOrFn: StrOrFn<T>, props: T): string
export function getStringOrFunction<T>(
  strOrFn: StrOrFn<T> | undefined,
  props: T
): string | undefined
export function getStringOrFunction<T>(
  strOrFn: StrOrFn<T> | undefined,
  props: T
): string | undefined {
  return typeof strOrFn === 'function' ? strOrFn(props) : strOrFn
}

/** Sometimes we need to join each page's title together */
export const getJoinedTitle = (
  suffix: string,
  title: string,
  joinTitles: boolean
) => {
  if (!joinTitles || !suffix) {
    return title
  }

  return `${title} | ${suffix}`
}

export const getPathArray = (p: string) => p.split('/').filter((x) => x !== '')

export const renderPage = (
  site: BuiltSite,
  pageContent: BuiltPage[1]
): {
  body: HdNode
  head: HdNode
} => {
  const props = { props: pageContent.props, data: site.data }

  const head = pageContent.head ?? site.head
  const body = pageContent.content

  return {
    body: body(props),
    head: head(props)
  }
}
