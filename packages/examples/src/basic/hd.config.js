import { defineHdConfig } from 'hd-web'
import { hdWebPluginImages } from '@hd-web/images'

export default defineHdConfig({
  entry: './main.tsx',
  out: 'dist',
  plugins: [hdWebPluginImages()]
})
