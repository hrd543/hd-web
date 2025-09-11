import { first } from './first.js'
import { second } from './second.js'

const blogs = [first, second]

// You could fetch this information from an api
// or use some sort of fs.readDir approach instead
export const getBlogs = async () => [...blogs]

export { buildBlogUrl } from './buildBlogUrl.js'
export { type BlogPost } from './types.js'
