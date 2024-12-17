export const startLoading = (button: Element) => {
  button.classList.add('Button--loading')
}

export const stopLoading = (button: Element) => {
  button.classList.remove('Button--loading')
}

export const isLoading = (button: Element) => {
  return button.classList.contains('Button--loading')
}
