import { Image } from '../../global/index.js'
import { BlogInfo } from '../BlogInfo/BlogInfo.js'
import './BlogCard.css'

import { FuncComponent } from 'hd-web'

export type BlogCardProps = {
  thumbnail: {
    src: string
    alt: string
    srcMobile?: string
  }
  title: string
  link: string
  author: string
  date: Date
}

export const BlogCard: FuncComponent<BlogCardProps> = ({
  thumbnail,
  title,
  link,
  author,
  date
}) => {
  return (
    <article class="BlogCard">
      <div class="BlogCard__content">
        <a href={link}>
          <h3 class="BlogCard__title">{title}</h3>
        </a>
        <BlogInfo date={date} author={author} />
      </div>
      <Image {...thumbnail} ratio={16 / 9} />
    </article>
  )
}
