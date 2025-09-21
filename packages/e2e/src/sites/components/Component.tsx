import { type View, registerClient } from 'hd-web'

import ComponentClient, { type ComponentProps } from './Component.client.js'

export const Component: View<ComponentProps> = ({ id }) => {
  return (
    <div id={`component-${id}`} $click="handleClick">
      <div id={`ref-${id}`} ref="element">
        Ref
      </div>
      <div id={`event-${id}`} $newEvent="handleEvent">
        Event
      </div>
      <div id={`props-${id}`} $props="handleProps">
        Props
      </div>
    </div>
  )
}

registerClient(Component, ComponentClient)
