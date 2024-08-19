import * as esbuild from 'esbuild'
import * as path from 'path'
import * as url from 'url'

const packageDefaults: esbuild.BuildOptions = {
  bundle: true,
  format: 'esm',
  minify: true,
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js'
}

/** Get the dependencies given the paths to the package.json files */
const getDependencies = async (dependencyPaths: string[]) => {
  const dependencyJsons = await Promise.all(
    dependencyPaths.map((p) => {
      // Transform relative paths into absolute based on cwd
      const filePathUrl = url.pathToFileURL(path.resolve(process.cwd(), p))

      return import(filePathUrl.href, { with: { type: 'json' } })
    })
  )

  return dependencyJsons.reduce<string[]>((all, json) => {
    if (json.dependencies) {
      all.push(...Object.keys(json.dependencies))
    }

    if (json.devDependencies) {
      all.push(...Object.keys(json.devDependencies))
    }

    return all
  }, [])
}

/**
 * Build a package using the default options and excluding any
 * dependencies mentioned in the attached package.json files
 */
export const buildPackage = async (
  dependencyPaths: string[],
  config?: Partial<esbuild.BuildOptions>
) => {
  const dependencies = await getDependencies(dependencyPaths)

  return await esbuild.build({
    ...packageDefaults,
    external: [
      ...(config?.external ?? []),
      // make sure we don't bundle in any dependencies,
      // so that we leave them as imports.
      // This reduces the chance of duplicated code.
      ...dependencies
    ],
    ...config
  })
}
