// TODO where should this go?

import { BaseProps, FuncComponent, IComponent } from './types.js'

// could add a pure comment here for esbuild?
export const registerClient = <P extends BaseProps>(
  func: FuncComponent<P>,
  component: IComponent
) => {
  func.client = component
}
