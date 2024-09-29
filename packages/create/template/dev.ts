import { startDev } from '@hd-web/build'

// This file is run when developing locally. Try running npm run dev and go to
// localhost:8080 to see your site!
startDev({
  entryDir: 'src',
  pageFilename: 'index.tsx',
  port: 8080
})
