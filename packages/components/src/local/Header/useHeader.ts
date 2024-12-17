import { InteractCallback } from '@hd-web/build'
import { getContainerElement } from '../../shared/getContainerElement.js'

export const useHeader: InteractCallback = (id) => {
  const header = getContainerElement(id, 'header') as HTMLElement

  const showHideMenu = (el: Element, show: boolean) => {
    const type = show ? 'add' : 'remove'
    el.querySelector('.hd-header_links')!.classList[type](
      'hd-header_links--show'
    )
    el.querySelector('.MenuButton')!.classList[type]('MenuButton--open')
  }

  const handleClick = (e: MouseEvent) => {
    if (!e.target || !e.currentTarget) {
      return
    }

    const target = e.target as Element
    const el = e.currentTarget as Element

    // Need to check what we clicked on. If it was a link,
    // then hide the menu
    if (target.tagName === 'A' || target.tagName === 'LI') {
      showHideMenu(el, false)
    }

    // If the menu button, then show/hide
    if (el.querySelector('.MenuButton')!.contains(target)) {
      if (
        el
          .querySelector('.hd-header_links')!
          .classList.contains('hd-header_links--show')
      ) {
        showHideMenu(el, false)
      } else {
        showHideMenu(el, true)
      }
    }
  }

  header.addEventListener('click', handleClick)
}
