import { InteractCallback } from '@hd-web/build'

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
  const button = document.querySelector(`[data-hd-id="${id}"]`)

  if (!button) {
    throw new Error('Did you forget to wrap your button with data-hd-id?')
  }

  button.addEventListener('click', (e) => {
    // If we're loading, don't allow further clicks
    if (isLoading(e.currentTarget as HTMLButtonElement)) {
      e.stopImmediatePropagation()
    }
  })
}
