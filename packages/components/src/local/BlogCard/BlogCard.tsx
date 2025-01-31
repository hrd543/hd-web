import { formatShortDate } from '../../shared/formatDate.js'
import './Card.css'

import { type JSX } from '@hd-web/jsx'

export type BlogCardProps = {
  thumbnailSrc: string
  thumbnailAlt: string
  title: string
  author: string
  date: Date
}

export const BlogCard: JSX.FuncComponent<BlogCardProps> = ({
  thumbnailSrc,
  thumbnailAlt,
  title,
  author,
  date
}) => {
  return (
    <article class="Card">
      <div class="Card__content">
        <h3 class="Card__title">{title}</h3>
        <div class="Card__info">
          <p class="Card__author">{author}</p>
          <p class="Card__date">{formatShortDate(date)}</p>
        </div>
      </div>
      <div class="Card__thumbnail">
        <img src={thumbnailSrc} alt={thumbnailAlt} />
      </div>
    </article>
  )
}
