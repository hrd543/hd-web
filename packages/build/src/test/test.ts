import { buildDev } from '../dev/startDev.js'

await buildDev({
  entryDir: 'src',
  outDir: 'dev'
})
