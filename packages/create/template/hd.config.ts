import type { HdConfig } from 'hd-web'

export default (): HdConfig => ({
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
