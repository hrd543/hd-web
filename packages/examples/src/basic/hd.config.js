import { defineHdConfig } from 'hd-web'
import { hdPluginFiles } from '@hd-web/files'

export default defineHdConfig({
  entry: './main.tsx',
  out: 'dist',
  plugins: [hdPluginFiles(['.jpg'])]
})
