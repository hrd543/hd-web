import * as esbuild from 'esbuild'
import packageJson from './package.json'

export const generateBuildConfig = (
  dependencies: string[],
  config?: esbuild.BuildOptions
): esbuild.BuildOptions => {
  return {
    bundle: true,
    format: 'esm',
    minify: true,
    ...config,
    external: [
      ...(config?.external ?? []),
      // make sure we don't bundle in any dependencies,
      // so that we leave them as imports.
      // This reduces the chance of duplicated code.
      ...dependencies,
      ...Object.keys(packageJson.devDependencies)
    ]
  }
}
