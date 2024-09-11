import path from 'path'
import { buildFile } from './constants.js'

export const getBuildFile = (dir: string) => path.resolve(dir, buildFile)
