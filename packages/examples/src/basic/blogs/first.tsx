import { BlogPost } from './types.js'

export const first: BlogPost = {
  title: 'My first blog',
  content: () => (
    <>
      <h2>The first chapter</h2>
      <p>Where to begin this blog?</p>

      <h2>The last chapter</h2>
      <p>That was quick</p>
    </>
  )
}
