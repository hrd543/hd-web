import './Carousel.css'

import { type JSX } from '@hd-web/jsx'
import { carousel } from './carouselInteract.js'
import { interact } from '@hd-web/build'
import { attachIdToElement } from '@hd-web/components'

export type CarouselProps = {
  items: JSX.Element[]
  minWidth: number
  maxItemsPerSlide?: number
  label: string
  prevIcon: JSX.Element
  nextIcon: JSX.Element
  gap?: string
}

const getItemLabel = (index: number, count: number) =>
  `${index + 1} of ${count}`

export const Carousel: JSX.FuncComponent<CarouselProps> = ({
  items,
  label,
  prevIcon,
  nextIcon,
  minWidth,
  maxItemsPerSlide = Infinity,
  gap = 'var(--sp-400)'
}) => {
  const id = interact(carousel, {
    minWidth,
    maxItemsPerSlide,
    itemCount: items.length,
    gap
  })

  return (
    <div
      class="hd-carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      {...attachIdToElement(id)}
    >
      <button
        class="hd-carousel__prev"
        aria-label="Previous"
        aria-controls="hd-carousel-items"
      >
        {prevIcon}
      </button>
      <div class="hd-carousel__main">
        <div
          class="hd-carousel__items"
          style={{ gap }}
          aria-live="polite"
          id="hd-carousel-items"
        >
          {items.map((item, index) => {
            return (
              <div
                role="group"
                class="hd-carousel__item"
                aria-roledescription="slide"
                aria-label={getItemLabel(index, items.length)}
              >
                {item}
              </div>
            )
          })}
        </div>
      </div>
      <button
        class="hd-carousel__next"
        aria-label="Next"
        aria-controls="hd-carousel-items"
      >
        {nextIcon}
      </button>
    </div>
  )
}
