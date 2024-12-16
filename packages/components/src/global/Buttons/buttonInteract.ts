import { InteractCallback } from '@hd-web/build'
import { getContainerElement } from '../../shared/getContainerElement.js'

export const startLoading = (button: Element) => {
  button.classList.add('Button--loading')
}

export const stopLoading = (button: Element) => {
  button.classList.remove('Button--loading')
}

export const isLoading = (button: Element) => {
  return button.classList.contains('Button--loading')
}

export const buttonInteract: InteractCallback = (id) => {
  const button = getContainerElement(id, 'button')

  button.addEventListener('click', (e) => {
    // If we're loading, don't allow further clicks
    if (isLoading(e.currentTarget as HTMLButtonElement)) {
      e.stopImmediatePropagation()
    }
  })
}
