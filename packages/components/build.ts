// Github actions doesn't seem to work with the
// hd package command
import { buildPackage } from 'hd-web'

await buildPackage('src', 'dist', '.+\\.css$')
