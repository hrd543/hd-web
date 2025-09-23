import type { HdBuildConfig } from './build/index.js'
import type { SharedConfig } from './config/index.js'
import type { HdDevConfig } from './dev/index.js'

export { build, type BuiltFile, type HdBuildConfig } from './build/index.js'
export { buildPackage } from './build-package/index.js'
export { Behaviour } from './client/index.js'
export { dev, type HdDevConfig } from './dev/index.js'
export { HdError, type HdErrorKey } from './errors/index.js'
export type { Page, PageContent, Site } from './shared/index.js'
export { cleanPath } from './shared/index.js'
export { Enhance, type EnhanceViewProps } from './enhancements/index.js'
export {
  type BaseProps,
  type View,
  type HdElement,
  type HdNode,
  type Html,
  type IBehaviourConstructor,
  type IBehaviour,
  type Props
} from '@hd-web/jsx'

export const defineHdConfig = (config?: {
  shared?: Partial<SharedConfig>
  build?: Partial<HdBuildConfig>
  dev?: Partial<HdDevConfig>
}) => config
