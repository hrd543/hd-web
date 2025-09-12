import { defineHdConfig } from 'hd-web'

// TODO: find a way to put this inside each example folder

export default defineHdConfig({
  shared: {
    entry: 'src/basic/main.tsx'
  },
  build: {
    out: 'dist'
  }
})
