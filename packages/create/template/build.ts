import { buildSite } from '@hd-web/build'

// This file is run when building your site. These options dictate
// where your files come from and will be built.
// Try running npm run build and look inside the build folder.
buildSite(
  { entry: 'src/index.tsx', output: 'build/main.js' },
  { entry: 'src/index.html', output: 'build/index.html' }
)
