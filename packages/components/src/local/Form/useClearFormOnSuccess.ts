import { InteractHook } from '@hd-web/build'
import { type JSX } from '@hd-web/jsx'

import { getContainerElement } from '../../shared/index.js'
import { hdFormEventKey } from './events.js'

export type UseClearFormOnSuccess = {
  element: JSX.Element
}

/**
 * Listen for an `HdFormEvent` representing a successful form submission
 * and replace the form element with `element`
 */
export const useClearFormOnSuccess: InteractHook<UseClearFormOnSuccess> = (
  id,
  { element }
) => {
  const container = getContainerElement(id, 'form') as HTMLElement
  const form = container.querySelector('form')!
  const template = document.createElement('template')
  template.innerHTML = element ?? ''
  const successElement = template.content

  form.addEventListener(hdFormEventKey, (event) => {
    if (event.detail.type === 'success') {
      form.replaceWith(successElement)
    }
  })
}
