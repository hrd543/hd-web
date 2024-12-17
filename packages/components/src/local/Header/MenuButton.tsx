import { JSX } from '@hd-web/jsx'
import './MenuButton.css'

type MenuButtonProps = {
  height: number
  className?: string
}

export const MenuButton: JSX.FuncComponent<MenuButtonProps> = ({
  height,
  className
}) => {
  return (
    <button
      class={`MenuButton ${className}`}
      aria-haspopup="menu"
      aria-label="Open Navigation Menu"
      aria-expanded="false"
    >
      <svg
        viewBox="0 0 100 100"
        height={height}
        width={height}
        xmlns="http://www.w3.org/2000/svg"
        class="MenuButton_svg"
      >
        <g fill="none" stroke="#000" stroke-width="6.0008">
          <path
            class="topLine line"
            d="m11.734 23.67h60.008c11.988 0 18.297 30.476 14.506 49.793-0.73988 3.7698-2.739 8.7469-6.5668 9.4714-4.0138 0.75961-7.9004-3.618-7.9004-3.618l-60.046-58.65"
          />
          <path class="middleLine line" d="m11.734 50h60.008" />
          <path
            class="bottomLine line"
            d="m11.734 76.33h60.007c11.988 0 18.297-30.476 14.506-49.793-0.73988-3.7698-2.739-8.7469-6.5668-9.4714-4.0138-0.75961-7.9004 3.618-7.9004 3.618l-60.046 58.65"
          />
        </g>
      </svg>
    </button>
  )
}
