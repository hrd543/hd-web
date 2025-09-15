import { Page, Site } from 'hd-web'

type Data = { x: number[] }

const childPage: Page<Data, number> = {
  getPageData: (data, path) => data.x[Number(path.at(-1))]!,
  content: ({ pageData }) => <div id={pageData}>Content</div>,
  title: (item) => `Item ${item}`
}

const site: Site<Data> = {
  root: {
    title: 'Data site',
    content: ({ siteData }) => <div id="content">{`${siteData.x.length}`}</div>,
    routes: ({ x }) => x.reduce((all, x, i) => ({ ...all, [i]: childPage }), {})
  },
  head: () => <meta id="head" name="test" />,
  getSiteData: () => ({ x: [5, 4, 3, 2, 1] })
}

export default site
