import { type JSX } from '@hd-web/jsx'
import { addTermsField, removeTermsField } from './addTermsField.js'
import { WebComponent } from '../../shared/WebComponent.js'
import { Toast } from '../Toast/Toast.js'

export type HdFormProps = {
  action: string
}

const successMessage =
  "Thanks, we've received your message and will be in touch"

export class HdForm extends WebComponent {
  static override _key = 'hd-form'
  props: JSX.Props<HdFormProps>
  loading: boolean

  constructor() {
    super()

    this.loading = false
    const action = this.getAttribute('action')
    if (!action) {
      throw new Error('action not provided to form')
    }
    this.props = { action }

    this.initListener('form', 'submit', this.submitForm.bind(this))
    this.initListener('textarea', 'input', this.startTyping.bind(this))
  }

  private startedTyping: number | undefined

  private finish(form: HTMLFormElement, reset = true) {
    this.querySelector('hd-button')?.stopLoading()
    this.startedTyping = undefined
    this.loading = false

    if (reset) {
      form.reset()
    }
  }

  private start() {
    this.querySelector('hd-button')?.startLoading()
    this.loading = true
  }

  async submitForm(e: SubmitEvent) {
    e.preventDefault()
    if (this.loading) {
      e.stopPropagation()

      return
    }
    this.start()
    const form = e.currentTarget as HTMLFormElement

    setTimeout(async () => {
      // In this case, it's likely to have been a bot, so reset the form
      // and show a success message
      if (this.startedTyping && Date.now() - this.startedTyping < 1000) {
        this.finish(form)
        Toast.show(successMessage, 'success', 5000)

        return
      }

      const formData = new FormData(form)

      if (formData.has('terms')) {
        this.finish(form)
        Toast.show(successMessage, 'success', 5000)

        return
      }

      const response = await fetch(this.props.action, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        this.finish(form)
        Toast.show(successMessage, 'success', 5000)
      } else {
        Toast.show(
          "Sorry, there's been an error, please try again later",
          'failure',
          5000
        )

        this.finish(form, false)
      }
    }, 3000)
  }

  startTyping() {
    this.startedTyping ??= Date.now()
  }

  override connect() {
    addTermsField(this.querySelector('form'))
  }

  override disconnect() {
    removeTermsField(this.querySelector('form'))
  }
}
