export type PageReturn =
  | {
      body: string
      routes?: Record<string, Page>
    }
  | string

export type Page = () => PageReturn | Promise<PageReturn>

export type BuiltPage = [path: string, content: string]
