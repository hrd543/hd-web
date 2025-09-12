import { Site } from 'hd-web'

import hd from '../assets/img.hd'
import jpg from '../assets/img.jpg'
import png from '../assets/img.png'
import webp from '../assets/img.webp'

const images: Site = {
  head: () => <meta id="head" name="test" />,
  root: {
    title: 'Single page site',
    content: () => (
      <div id="content">
        <img src={webp} id="webp" />
        <img src={png} id="png" />
        <img src={jpg} id="jpg" />
        <img src={hd} id="hd" />
      </div>
    )
  }
}

export default images
