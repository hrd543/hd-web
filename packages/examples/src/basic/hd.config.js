import { defineHdConfig } from 'hd-web'

export default defineHdConfig({
  shared: {
    entry: './main.tsx'
  },
  build: {
    out: 'dist'
  }
})
