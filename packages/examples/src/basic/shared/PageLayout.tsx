// import { Header } from '@hd-web/components/local'
import { type View } from 'hd-web'
import henry from '../img/henry.jpg'
import unused from '../img/unused.jpg'
import { Image } from '@hd-web/images'

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
      <img src={henry.src} />
      <Image src={unused} compression={0.5} alt="" />
      {children}
      <footer>Created with hd-web</footer>
    </>
  )
}
