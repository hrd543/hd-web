import { BlogInfo } from '../BlogInfo/BlogInfo.js'
import './BlogCard.css'

import { type JSX } from '@hd-web/jsx'

export type BlogCardProps = {
  thumbnailSrc: string
  thumbnailAlt: string
  title: string
  link: string
  author: string
  date: Date
}

export const BlogCard: JSX.FuncComponent<BlogCardProps> = ({
  thumbnailSrc,
  thumbnailAlt,
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
      <div class="BlogCard__thumbnail">
        <img src={thumbnailSrc} alt={thumbnailAlt} />
      </div>
    </article>
  )
}
