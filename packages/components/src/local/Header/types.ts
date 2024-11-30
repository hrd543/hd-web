type HeaderItem = {
  link: string
  title: string
}

export type HeaderProps = {
  logo: string
  items: HeaderItem[]
  bgColour: string
  fontColour: string
  height?: string
  className?: string
}
