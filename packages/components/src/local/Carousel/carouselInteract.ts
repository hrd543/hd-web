import { InteractCallback } from '@hd-web/build'
import { getContainerElement } from '../../shared/getContainerElement.js'

type HdCarouselProps = {
  minWidth: number
  maxItemsPerSlide: number
  itemCount: number
  gap: string
}

const getSlideCount = (itemCount: number, itemsPerSlide: number) =>
  Math.ceil(itemCount / itemsPerSlide)

export const carousel: InteractCallback<HdCarouselProps> = (
  id,
  { minWidth, maxItemsPerSlide, itemCount, gap }
) => {
  const container = getContainerElement(id, 'carousel')

  // state
  let activeIndex = 0
  let itemsPerSlide = 0

  // We want to attach listeners to the buttons to change the activeIndex
  const items = container.querySelector('.hd-carousel__items') as HTMLDivElement

  const updateActiveIndex = (index: number) => {
    if (index === activeIndex) {
      return
    }

    activeIndex = index
    items.style.transform =
      activeIndex === 0
        ? ''
        : `translateX(calc(-${100 * activeIndex}% - ${activeIndex} * ${gap}))`
  }

  const prev = () => {
    updateActiveIndex(
      activeIndex === 0
        ? getSlideCount(itemCount, itemsPerSlide) - 1
        : activeIndex - 1
    )
  }

  const next = () => {
    updateActiveIndex(
      activeIndex === getSlideCount(itemCount, itemsPerSlide) - 1
        ? 0
        : activeIndex + 1
    )
  }

  container.querySelector('.hd-carousel__prev')?.addEventListener('click', prev)
  container.querySelector('.hd-carousel__next')?.addEventListener('click', next)

  const updateItemsPerSlide = (unboundedCount: number) => {
    const newCount = Math.min(unboundedCount, maxItemsPerSlide)

    if (itemsPerSlide === newCount) {
      return
    }

    itemsPerSlide = newCount
    items.style.gridAutoColumns =
      itemsPerSlide === 1
        ? '100%'
        : `calc((100% - ${itemsPerSlide - 1} * ${gap}) / ${itemsPerSlide})`
    const slideCount = getSlideCount(itemCount, newCount)
    updateActiveIndex(Math.min(activeIndex, slideCount - 1))
  }
  // And listen for the item container being resized in order to change itemsPerSlide
  const resize = new ResizeObserver((entries) => {
    // We're only observing one element, the items container
    const entry = entries[0]!
    const W = entry.borderBoxSize[0]!.inlineSize
    const g = Number(
      window.getComputedStyle(entry.target).getPropertyValue('gap').slice(0, -2)
    )
    // const w = (W - (itemsPerSlide - 1) * g) / itemsPerSlide

    updateItemsPerSlide(Math.floor((W + g) / (minWidth + g)))
  })

  resize.observe(items)
}
