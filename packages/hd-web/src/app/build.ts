import { build } from '../build/build.js'

await build({ out: 'dist', entry: './main.tsx' })
