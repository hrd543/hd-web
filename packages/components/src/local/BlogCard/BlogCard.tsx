import { formatShortDate } from '../../shared/formatDate.js'
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
        <div class="BlogCard__info">
          <p class="BlogCard__author">{author}</p>
          <p class="BlogCard__date">{formatShortDate(date)}</p>
        </div>
      </div>
      <div class="BlogCard__thumbnail">
        <img src={thumbnailSrc} alt={thumbnailAlt} />
      </div>
    </article>
  )
}
