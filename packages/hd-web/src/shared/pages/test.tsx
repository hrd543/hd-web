import { Page, Site } from './types.js'

type Blog = {
  title: string
  content: () => string
}

type Data = {
  blogs: Blog[]
  blogsById: Record<string, Blog>
}

const blogPage: Page<Data, Blog> = {
  title: (blog) => blog.title,
  content: ({ props: blog }) => blog.content(),
  props: ({ blogsById }, path) => blogsById[path[-1]!]!
}

const allBlogsPage: Page<Data> = {
  title: 'Blog',
  content: ({ data }) => (
    <div>
      {data.blogs.map((b) => (
        <li>{b.title}</li>
      ))}
    </div>
  ),
  routes: (data) =>
    data.blogs.reduce(
      (all, b) => ({
        ...all,
        [b.title]: blogPage
      }),
      {} as Record<string, Page<Data, Blog>>
    )
}

const homePage: Page<Data> = {
  title: 'Home',
  content: ({ data }) => (
    <div>
      {data.blogs.map((b) => (
        <li>{b.title}</li>
      ))}
    </div>
  ),
  routes: {
    blog: allBlogsPage
  }
}

export const site: Site<Data> = {
  root: homePage,
  head: () => '',
  getData: () => ({
    blogs: [],
    blogsById: {}
  })
}
