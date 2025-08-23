import { FuncComponent } from 'hd-web'

/**
 * Add information like the charset and viewport to the html head element
 */
export const Meta: FuncComponent = () => {
  return (
    <>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    </>
  )
}
