import { SiteFunction } from 'hd-web'

import hd from '../assets/img.hd'
import jpg from '../assets/img.jpg'
import png from '../assets/img.png'
import webp from '../assets/img.webp'

const images: SiteFunction = () => ({
  title: 'Single page site',
  body: () => (
    <div id="content">
      <img src={webp} id="webp" />
      <img src={png} id="png" />
      <img src={jpg} id="jpg" />
      <img src={hd} id="hd" />
    </div>
  ),
  head: () => <meta id="head" name="test" />
})

export default images
