import { Component, JSX, Template } from '@hd-web/jsx'
import { MenuButton } from './MenuButton.js'

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

@Template({
  render: ({
    items,
    logo,
    className = '',
    height = '64px',
    bgColour,
    fontColour
  }) => {
    return (
      <nav
        class={`hd-header ${className ?? ''}`}
        style={{
          '--_height': height,
          '--_bg-colour': bgColour,
          '--_font-colour': fontColour
        }}
      >
        <div $click="handleClick" class="hd-header_container">
          <a href="/" class="hd-header_logo">
            {logo}
          </a>
          <ul ref="links" class="hd-header_links">
            {items.map(({ link, title }) => (
              <li class="hd-header_item">
                <a href={link}>{title}</a>
              </li>
            ))}
          </ul>
          <MenuButton height={30} className="hd-header_menuButton" />
        </div>
      </nav>
    )
  }
})
export class Header extends Component<HeaderProps> {
  private toggleMenu() {
    const links = this.refs.get('links')!
    const menu = this.refs.get('menu')!

    links.classList.toggle('hd-header_links--show')
    menu.classList.toggle('MenuButton--open')
    menu.ariaExpanded = menu.ariaExpanded === 'true' ? 'false' : 'true'
  }

  handleClick(e: JSX.TypedMouseEvent<HTMLDivElement>) {
    if (!e.target) {
      return
    }

    // Need to check what we clicked on. If it was a link,
    // then hide the menu
    if (e.target.tagName === 'A' || e.target.tagName === 'LI') {
      this.toggleMenu()
    }

    if (this.refs.get('menu')?.contains(e.target)) {
      this.toggleMenu()
    }
  }
}
