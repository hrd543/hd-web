export type ButtonType = 'primary' | 'secondary' | 'tertiary'

export type ButtonProps = {
  type: ButtonType
  disabled?: boolean
  title: string
}
