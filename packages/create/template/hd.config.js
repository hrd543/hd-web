import { defineHdConfig } from 'hd-web'

export default defineHdConfig({
  shared: {
    entry: 'src/index.tsx'
  },
  build: {
    staticFolder: 'static',
    out: 'build'
  },
  dev: {
    port: 8080
  }
})
