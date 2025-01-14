import { JSX } from '@hd-web/jsx'

type HeaderItem = {
  link: string
  title: string
}

export type HeaderProps = {
  logo: JSX.Element
  items: HeaderItem[]
  bgColour: string
  fontColour: string
  height?: string
  className?: string
}
