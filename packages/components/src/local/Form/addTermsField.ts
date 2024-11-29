const formError = () => new Error('Form not provided')

const termsId = 'terms'
const termsLabelId = 'termsLabel'

export const removeTermsField = (form: HTMLFormElement | null) => {
  if (!form) {
    throw formError()
  }

  form.querySelector(`#${termsId}`)?.remove()
  form.querySelector(`#${termsLabelId}`)?.remove()
}

export const addTermsField = (form: HTMLFormElement | null) => {
  if (!form) {
    throw formError()
  }

  const terms = document.createElement('input')
  terms.name = 'terms'
  terms.id = termsId
  terms.type = 'checkbox'
  terms.tabIndex = -1
  terms.autocomplete = 'off'
  terms.style.display = 'none'

  const label = document.createElement('label')
  label.htmlFor = termsId
  label.id = termsLabelId
  label.textContent = 'Do you accept the T&Cs?'
  label.style.display = 'none'

  form.appendChild(terms)
  form.appendChild(label)
}
