// import { describe, it } from 'node:test'

// import assert from 'assert/strict'
// import * as cheerio from 'cheerio'
// import { build } from 'hd-web'

// const getImgRegex = (fileType: string, imgSrc = false) =>
//   new RegExp(`${imgSrc ? '\\/' : ''}img-[^.]+\\.${fileType}`)

// describe('Images', async () => {
//   const built = (await build({
//     write: false,
//     entry: 'src/sites/images.tsx',
//     out: 'out',
//     fileTypes: ['.hd']
//   }))!

//   const $ = cheerio.load(
//     built.find((f) => f.relativePath === 'index.html')!.contents!
//   )

//   it('should copy over images', () => {
//     assert.ok(built.find((f) => f.relativePath.match(getImgRegex('webp'))))
//     assert.ok(built.find((f) => f.relativePath.match(getImgRegex('png'))))
//     assert.ok(built.find((f) => f.relativePath.match(getImgRegex('jpg'))))
//   })

//   it('should work with extra file types', () => {
//     assert.ok(built.find((f) => f.relativePath.match(getImgRegex('hd'))))
//   })

//   it('should assign the path correctly for img src', () => {
//     assert.match($('#webp').prop('src') ?? '', getImgRegex('webp', true))
//     assert.match($('#png').prop('src') ?? '', getImgRegex('png', true))
//     assert.match($('#jpg').prop('src') ?? '', getImgRegex('jpg', true))
//   })
// })

// TODO fix this once the image plugin works again
