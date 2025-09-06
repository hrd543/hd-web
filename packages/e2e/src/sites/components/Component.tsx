import { type FuncComponent, registerClient } from 'hd-web'

import ComponentClient from './Component.client.js'

export const Component: FuncComponent<{ id: number }> = ({ id }) => {
  return (
    <div id={`component-${id}`} $click="handleClick">
      <div id={`ref-${id}`} ref="element">
        Ref
      </div>
      <div id={`event-${id}`} $newEvent="handleEvent">
        Event
      </div>
    </div>
  )
}

registerClient(Component, ComponentClient)
