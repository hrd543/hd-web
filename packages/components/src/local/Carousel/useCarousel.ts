import { InteractHook } from '@hd-web/build'
import { getContainerElement } from '../../shared/getContainerElement.js'

type UseCarouselProps = {
  minWidth: number
  maxItemsPerSlide: number
  itemCount: number
  gap: string
}

export const useCarousel: InteractHook<UseCarouselProps> = (
  id,
  { minWidth, maxItemsPerSlide, itemCount, gap }
) => {
  const carousel = getContainerElement(id, 'carousel')
  const itemsDiv = carousel.querySelector(
    '.hd-carousel__items'
  ) as HTMLDivElement

  // state
  let activeIndex = 0
  let itemsPerSlide = 0

  const updateActiveIndex = (index: number) => {
    if (index === activeIndex) {
      return
    }

    activeIndex = index
    itemsDiv.style.transform = getTransform(index, gap)
  }

  const updateItemsPerSlide = (unboundedCount: number) => {
    const newCount = Math.min(unboundedCount, maxItemsPerSlide)
    if (itemsPerSlide === newCount) {
      return
    }

    itemsPerSlide = newCount
    itemsDiv.style.gridAutoColumns = getGridColumns(newCount, gap)
    updateActiveIndex(
      Math.min(activeIndex, getSlideCount(itemCount, newCount) - 1)
    )
  }

  // Handlers
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

  carousel.querySelector('.hd-carousel__prev')?.addEventListener('click', prev)
  carousel.querySelector('.hd-carousel__next')?.addEventListener('click', next)

  // Each time the itemsDiv is resized, we make sure each item is wider
  // than the minimum width
  const itemsDivStyle = window.getComputedStyle(itemsDiv)
  const resize = new ResizeObserver((entries) => {
    const W = entries[0]!.borderBoxSize[0]!.inlineSize
    const g = getComputedGap(itemsDivStyle)

    // This calculation comes from two equations:
    // 1. The width of the container is the items plus gaps
    // 2. The width of each item should be greater than the minWidth
    updateItemsPerSlide(Math.floor((W + g) / (minWidth + g)))
  })

  resize.observe(itemsDiv)
}

const getSlideCount = (itemCount: number, itemsPerSlide: number) =>
  Math.ceil(itemCount / itemsPerSlide)

/** Push the items back so that we only see those we should be visible */
const getTransform = (activeIndex: number, gap: string) => {
  if (activeIndex === 0) {
    return ''
  }

  return `translateX(calc(-${100 * activeIndex}% - ${activeIndex} * ${gap}))`
}

/** Make the carousel show only x items at once */
const getGridColumns = (itemsPerSlide: number, gap: string) => {
  if (itemsPerSlide === 1) {
    return '100%'
  }

  return `calc((100% - ${itemsPerSlide - 1} * ${gap}) / ${itemsPerSlide})`
}

/** Get the actual value of the grid gap, in px */
const getComputedGap = (style: CSSStyleDeclaration) =>
  // Remove the trailing px and convert into a number
  Number(style.getPropertyValue('gap').slice(0, -2))
