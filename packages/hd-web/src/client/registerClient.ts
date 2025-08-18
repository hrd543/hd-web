import type { BaseProps, FuncComponent, IComponent } from '@hd-web/jsx'

// could add a pure comment here for esbuild?
export const registerClient = <P extends BaseProps>(
  func: FuncComponent<P>,
  component: IComponent
) => {
  func.client = component
}
