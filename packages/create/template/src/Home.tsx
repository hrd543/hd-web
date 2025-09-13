import { Page } from 'hd-web'
import { NotFound } from '@hd-web/components/global'

// This is your home page (at localhost:8080/ for example).
// Try editing the content to see it update
export const Home: Page = {
  content: () => <div>Hello world!</div>,
  title: 'My new site!',
  description: 'My awesome new site made with hd-web',
  routes: {
    404: {
      title: 'Not found',
      content: () => <NotFound />
    }
  }
}
