import { build } from '../build/build.js'

const built = await build({ out: 'dist', entry: './main.tsx', write: true })

console.log(built?.map((b) => b.text))
