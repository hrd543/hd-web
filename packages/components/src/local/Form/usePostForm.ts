import { InteractHook } from '@hd-web/build'

import { addTermsField } from './addTermsField.js'
import { ButtonUtils } from '../../global/index.js'
import { getContainerElement } from '../../shared/getContainerElement.js'
import { HdFormDetail, HdFormEvent } from './events.js'

export type UsePostFormProps = {
  action: string
}

/**
 * Provides functionality for a simple form which will submit data via POST
 * to `action`.
 * This requires a `form` element within the container and a `button` element
 * to submit the form.
 *
 * On submit, will dispatch an `HdFormEvent` to the form element. This could be
 * used to, among other things, show a success / error message.
 *
 * A hidden terms field with the name `"terms"` will be added in order to
 * check for bots.
 */
export const usePostForm: InteractHook<UsePostFormProps> = (id, { action }) => {
  const container = getContainerElement(id, 'form') as HTMLElement

  let pageLoaded = Date.now()
  let loading = false

  const start = (f: HTMLFormElement) => {
    loading = true
    ButtonUtils.startLoading(f.querySelector('button')!)
  }

  const finish = (
    f: HTMLFormElement,
    eventDetails: HdFormDetail,
    reset = true
  ) => {
    loading = false
    pageLoaded = Date.now()
    ButtonUtils.stopLoading(f.querySelector('button')!)

    f.dispatchEvent(new HdFormEvent(eventDetails))

    if (reset) {
      f.reset()
    }
  }

  const submit = async (e: SubmitEvent) => {
    e.preventDefault()

    // Don't allow submitting the form if it's loading
    if (loading) {
      e.stopPropagation()

      return
    }

    const f = e.currentTarget as HTMLFormElement
    start(f)

    // In this case, it's likely to have been a bot, so reset the form
    // and show a success message
    if (Date.now() - pageLoaded < 3000) {
      finish(f, { type: 'success' })

      return
    }

    const formData = new FormData(f)

    // This indicates a bot probably filled this in
    if (formData.has('terms')) {
      finish(f, { type: 'success' })

      return
    }

    // Make the api call and dispatch the corresponding event
    const response = await fetch(action, {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      finish(f, { type: 'success' })
    } else {
      finish(f, { type: 'failure', message: response.statusText }, false)
    }
  }

  const form = container.querySelector('form')!
  form.addEventListener('submit', submit)
  addTermsField(id, form)
}
