import { View } from 'hd-web'

export type GoogleFont = {
  name: string
  weights: number[]
}

export type GoogleFontsProps = {
  fonts: GoogleFont[]
}

const getQueryString = (font: GoogleFont) =>
  `family=${font.name}:wght@${font.weights.join(';')}`

export const GoogleFonts: View<GoogleFontsProps> = ({ fonts }) => {
  if (fonts.length === 0) {
    return null
  }

  const query = fonts.map(getQueryString).join('&')

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
      />
      <link
        href={`https://fonts.googleapis.com/css2?${query}&display=swap`}
        rel="stylesheet"
      />
    </>
  )
}
