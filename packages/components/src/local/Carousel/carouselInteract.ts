import { getContainerElement } from '../../shared/getContainerElement.js'

type HdCarouselProps = {
  breakpoints: Array<{
    width: number
    count: number
  }>
  itemCount: number
  gap: string
}

const getSlideCount = (itemCount: number, itemsPerSlide: number) =>
  Math.ceil(itemCount / itemsPerSlide)

export const carousel = (
  id: number,
  { breakpoints, itemCount, gap }: HdCarouselProps
) => {
  const container = getContainerElement(id, 'carousel')
  let activeIndex = 0
  let itemsPerSlide = 0

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

  const updateItemsPerSlide = (newCount: number) => {
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

  const sortedBreakpoints = [...breakpoints].sort((a, b) => a.width - b.width)
  const handleResize = () => {
    let match = 0
    for (const b of sortedBreakpoints) {
      if (b.width <= window.innerWidth) {
        match = b.count
      }
    }

    if (match === 0) {
      throw new Error(
        `Width of ${window.innerWidth} didn't match any breakpoints.`
      )
    }

    updateItemsPerSlide(match)
  }

  window.addEventListener('resize', handleResize)
  // Make sure we display the right number initially.
  handleResize()
}
