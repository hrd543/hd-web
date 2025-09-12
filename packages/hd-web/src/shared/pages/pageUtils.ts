import path from 'path'

import { PageStack } from './types.js'

export const getRoutes = <T>(entry: PageStack<T>): Array<PageStack<T>> => {
  const [currentPath, { routes }, titleSuffix] = entry

  if (!routes) {
    return []
  }

  return Object.entries(routes).map<PageStack<T>>(([route, subPage]) => [
    path.posix.join(currentPath, route),
    subPage,
    titleSuffix
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

export const getPathArray = (p: string) => p.split('/').filter((x) => x)
