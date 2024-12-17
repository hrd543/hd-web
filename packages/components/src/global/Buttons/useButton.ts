import { InteractCallback } from '@hd-web/build'
import { getContainerElement } from '../../shared/getContainerElement.js'
import { isLoading } from './utils.js'

export const useButton: InteractCallback = (id) => {
  const button = getContainerElement(id, 'button')

  button.addEventListener('click', (e) => {
    // If we're loading, don't allow further clicks
    if (isLoading(e.currentTarget as HTMLButtonElement)) {
      e.stopImmediatePropagation()
    }
  })
}
