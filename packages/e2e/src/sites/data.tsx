import { Page, Site } from 'hd-web'

type Data = { x: number[] }

const childPage: Page<Data, number> = {
  props: (data, path) => data.x[Number(path.at(-1))]!,
  content: ({ props }) => <div id={props}>Content</div>,
  title: (props) => `Item ${props}`
}

const site: Site<Data> = {
  root: {
    title: 'Data site',
    content: ({ data }) => <div id="content">{`${data.x.length}`}</div>,
    routes: ({ x }) => x.reduce((all, x, i) => ({ ...all, [i]: childPage }), {})
  },
  head: () => <meta id="head" name="test" />,
  getData: () => ({ x: [5, 4, 3, 2, 1] })
}

export default site
