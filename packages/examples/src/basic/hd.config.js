import { defineHdConfig } from 'hd-web'
import { hdWebPluginMdContent } from '@hd-web/md-content'

export default defineHdConfig({
  entry: './main.tsx',
  out: 'dist',
  plugins: hdWebPluginMdContent({ imageQuality: 50 })
})
