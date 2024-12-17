import './Carousel.css'

import { type JSX } from '@hd-web/jsx'
import { carousel } from './carouselInteract.js'
import { interact } from '@hd-web/build'
import { attachIdToElement } from '@hd-web/components'

export type CarouselProps = {
  items: JSX.Element[]
  /** The number of slides visible at each breakpoint */
  breakpoints: Array<{
    width: number
    count: number
  }>
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
  breakpoints,
  gap = 'var(--sp-400)'
}) => {
  const id = interact(carousel, { breakpoints, itemCount: items.length, gap })

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

/*

There are two interactions we need to support
1. Clicking the next / prev buttons:
  - If we click next, we add one to the active index, or set it to 0
    if we're on the last slide.
  - If we click prev, we subtract one from the active index, or set
    it to the last slide if we're on 0

2. Resizing the window
  - Each time we resize, we need to change the number of cards which are visible
    at once, and make sure the activeIndex still points to something.

We have two pieces of reactive state:
- itemsPerSlide
- activeIndex




*/
