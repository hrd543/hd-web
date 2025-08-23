import { HdNode } from 'hd-web'

type HeaderItem = {
  link: string
  title: string
}

export type HeaderProps = {
  logo: HdNode
  items: HeaderItem[]
  bgColour: string
  fontColour: string
  height?: string
  className?: string
}
