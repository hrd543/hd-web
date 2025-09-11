import { type HdNode } from 'hd-web'

export type Blog = {
  title: string
  content: () => HdNode
}
