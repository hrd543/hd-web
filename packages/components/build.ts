import * as esbuild from 'esbuild'
import packageJson from './package.json' with {type: "json"}
import { generateBuildConfig } from '../../build.js'

const dependencies = Object.keys(packageJson.devDependencies)

await esbuild.build(
  generateBuildConfig(dependencies, {
    entryPoints: ['src/test.tsx'],
    outfile: 'dist/index.js'
  })
)
