import { formatLongDate, formatShortDate } from '../../shared/formatDate.js'
import './BlogInfo.css'

import { FuncComponent } from 'hd-web'

export type BlogInfoProps = {
  author: string
  date: Date
  format?: 'short' | 'long'
}

export const BlogInfo: FuncComponent<BlogInfoProps> = ({
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
