import { addTermsField } from './addTermsField.js'
import { Toast } from '../Toast/Toast.js'
import { InteractCallback } from '@hd-web/build'
import { ButtonUtils } from '../../global/index.js'

export type FormProps = {
  action: string
}

const successMessage =
  "Thanks, we've received your message and will be in touch"

export const formInteract: InteractCallback<FormProps> = (id, { action }) => {
  const form = document.querySelector(
    `[data-hd-id="${id}"]`
  ) as HTMLFormElement | null

  if (!form) {
    throw new Error('Did you forget to add an hd-id to your form?')
  }

  let startedTyping: number | null = null
  let loading = false

  const start = (f: HTMLFormElement) => {
    loading = true
    ButtonUtils.startLoading(f.querySelector('button')!)
  }

  const finish = (f: HTMLFormElement, reset = true) => {
    loading = false
    startedTyping = null
    ButtonUtils.stopLoading(f.querySelector('button')!)

    if (reset) {
      f.reset()
    }
  }

  const submit = (e: SubmitEvent) => {
    e.preventDefault()
    if (loading) {
      e.stopPropagation()

      return
    }

    const f = e.currentTarget as HTMLFormElement
    start(f)

    setTimeout(async () => {
      // In this case, it's likely to have been a bot, so reset the form
      // and show a success message
      if (startedTyping && Date.now() - startedTyping < 1000) {
        finish(f)
        Toast.show(successMessage, 'success', 5000)

        return
      }

      const formData = new FormData(f)

      if (formData.has('terms')) {
        finish(f)
        Toast.show(successMessage, 'success', 5000)

        return
      }

      const response = await fetch(action, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        finish(f)
        Toast.show(successMessage, 'success', 5000)
      } else {
        Toast.show(
          "Sorry, there's been an error, please try again later",
          'failure',
          5000
        )

        finish(f, false)
      }
    }, 3000)
  }

  form.addEventListener('submit', submit)
  form.querySelector('textarea')?.addEventListener('input', () => {
    startedTyping ??= Date.now()
  })
  addTermsField(form)
}
