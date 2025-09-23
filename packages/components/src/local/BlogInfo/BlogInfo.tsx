import './BlogInfo.css'

import { View } from 'hd-web'

import { formatLongDate, formatShortDate } from '../../shared/formatDate.js'

export type BlogInfoProps = {
  author: string
  date: Date
  format?: 'short' | 'long'
}

export const BlogInfo: View<BlogInfoProps> = ({
  author,
  date,
  format = 'short'
}) => {
  const formatter = format === 'short' ? formatShortDate : formatLongDate

  return (
    <div class="BlogInfo">
      <address>{author}</address>
      <time datetime={date.toISOString()}>{formatter(date)}</time>
    </div>
  )
}
