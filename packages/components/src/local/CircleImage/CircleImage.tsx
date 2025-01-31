import './CircleImage.css'

import type { JSX } from '@hd-web/jsx'

export type CircleImageProps = {
  src: string
  borderWidth: number
  borderColor: string
}

/**
 * An image with a circle clip path and a circle border.
 */
export const CircleImage: JSX.FuncComponent<CircleImageProps> = ({
  src,
  borderWidth,
  borderColor
}) => {
  return (
    <div class="CircleImage" style={{ 'background-color': borderColor }}>
      <img
        src={src}
        style={{
          width: `calc(100% - ${2 * borderWidth}px)`,
          transform: `translate(${borderWidth}px, ${borderWidth}px)`
        }}
      />
    </div>
  )
}
