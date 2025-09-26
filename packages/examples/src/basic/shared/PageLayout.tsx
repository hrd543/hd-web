// import { Header } from '@hd-web/components/local'
import { type View } from 'hd-web'
import henry from '../img/henry.jpg'

export const PageLayout: View = ({ children }) => {
  return (
    <>
      {/* <Header
        items={[
          { link: '/contact', title: 'Contact' },
          { link: '/blog', title: 'Blog' }
        ]}
        logo="hd-web"
        bgColour="#fff"
        fontColour="#000"
        height="48px"
      /> */}
      <img src={henry} />
      {children}
      <footer>Created with hd-web</footer>
    </>
  )
}
