import { type HdNode } from 'hd-web'

export type BlogPost = {
  title: string
  content: () => HdNode
}
