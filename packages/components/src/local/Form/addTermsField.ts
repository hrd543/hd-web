import { appendUniqueId } from '../../shared/appendUniqueId.js'

const formError = () => new Error('Form not provided')

const termsId = '_terms'
const termsLabelId = '_termsLabel'

export const addTermsField = (id: number, form: HTMLFormElement | null) => {
  if (!form) {
    throw formError()
  }

  const terms = document.createElement('input')
  terms.name = 'terms'
  terms.id = appendUniqueId(termsId, id)
  terms.type = 'checkbox'
  terms.tabIndex = -1
  terms.autocomplete = 'off'
  terms.style.display = 'none'

  const label = document.createElement('label')
  label.htmlFor = appendUniqueId(termsId, id)
  label.id = appendUniqueId(termsLabelId, id)
  label.textContent = 'Do you accept the T&Cs?'
  label.style.display = 'none'

  form.appendChild(terms)
  form.appendChild(label)
}
