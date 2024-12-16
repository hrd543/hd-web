import { getContainerElement } from '../../shared/getContainerElement.js'

type HdCarouselProps = {
  count: number
  gap: string
}

export const carousel = (id: number, props: HdCarouselProps) => {
  const container = getContainerElement(id, 'carousel')
  let activeIndex = 0

  const items = container.querySelector('.hd-carousel__items') as HTMLDivElement

  const setTransform = () => {
    items.style.transform =
      activeIndex === 0
        ? ''
        : `translateX(calc(-${100 * activeIndex}% - ${activeIndex} * ${props.gap}))`
  }

  const prev = () => {
    activeIndex = activeIndex === 0 ? props.count - 1 : activeIndex - 1
    setTransform()
  }

  const next = () => {
    activeIndex = activeIndex === props.count - 1 ? 0 : activeIndex + 1
    setTransform()
  }

  container.querySelector('.hd-carousel__prev')?.addEventListener('click', prev)
  container.querySelector('.hd-carousel__next')?.addEventListener('click', next)
}
