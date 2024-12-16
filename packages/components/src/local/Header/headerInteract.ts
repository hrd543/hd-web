import { InteractCallback } from '@hd-web/build'

export const header: InteractCallback = (id) => {
  const container = document.querySelector(
    `[data-hd-id="${id}"]`
  ) as HTMLElement | null
  if (!container) {
    throw new Error('Did you forget to attach an hd id to your header?')
  }

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

  container.addEventListener('click', handleClick)
}
