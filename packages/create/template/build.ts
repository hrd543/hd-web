import { buildSite } from '@hd-web/build'

// This file is run when building your site. These options dictate
// where your files come from and will be built.
// Try running npm run build and look inside the build folder.
buildSite({ entryDir: 'src', outDir: 'build', pageFilename: 'index.tsx' })
