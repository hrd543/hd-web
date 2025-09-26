import { HdImageRecord } from './types.js'

export const resetImages = () => (globalThis._hdImages = [])

export const registerImage = (image: HdImageRecord) => {
  globalThis._hdImages.push(image)
}

export const getImages = () => [...globalThis._hdImages]
