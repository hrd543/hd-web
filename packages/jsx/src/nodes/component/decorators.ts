import callsites from 'callsites'
import {
  BaseProps,
  ComponentRenderFunction,
  DomElement,
  IComponent
} from '../../types.js'

export type ComponentWithRender<
  T extends BaseProps = BaseProps,
  E extends DomElement = DomElement
> = IComponent<T, E> & {
  __render: ComponentRenderFunction<T>
  __filepath: string
}

export function Template<
  T extends BaseProps,
  E extends DomElement = DomElement
>({ render }: { render: ComponentRenderFunction<T> }) {
  const componentPath = callsites()[1]?.getFileName()

  return function (constructor: IComponent<T, E>) {
    ;(constructor as ComponentWithRender<T, E>).__render = render
    ;(constructor as ComponentWithRender<T, E>).__filepath = componentPath ?? ''
  }
}
