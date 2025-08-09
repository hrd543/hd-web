// This file is run when building your site. These options dictate
// where your files come from and will be built.
// Try running npm run build and look inside the build folder.

import { dev } from '@hd-web/esbuild-plugin'

await dev({ entry: 'src/index.tsx' })
