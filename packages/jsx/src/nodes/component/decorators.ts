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
  __name: string
}

export function Template<
  T extends BaseProps,
  E extends DomElement = DomElement
>({ render, name }: { render: ComponentRenderFunction<T>; name?: string }) {
  return function (constructor: IComponent<T, E>) {
    ;(constructor as ComponentWithRender<T, E>).__render = render
    ;(constructor as ComponentWithRender<T, E>).__name =
      name ?? constructor.name
  }
}
