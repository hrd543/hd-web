import './BlogCard.css'

import { View } from 'hd-web'

import { BlogInfo } from '../BlogInfo/BlogInfo.js'

export type BlogCardProps = {
  Thumbnail: View<{ width: number; height: number }>
  title: string
  link: string
  author: string
  date: Date
}

export const BlogCard: View<BlogCardProps> = ({
  Thumbnail,
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
      <Thumbnail width={300} height={169} />
    </article>
  )
}
