import { type View, Enhance } from 'hd-web'

import ComponentBehaviour from './Component.client.js'

export const Component: View<{ id: number; client: string }> = ({
  id,
  client
}) => {
  return (
    <Enhance.div
      with={ComponentBehaviour}
      using={{ client }}
      id={`component-${id}`}
    >
      <div id={`ref-${id}`} ref="element">
        Ref
      </div>
      <div id={`event-${id}`} ref="newEvent">
        Event
      </div>
      <div id={`props-${id}`} ref="props">
        Props
      </div>
    </Enhance.div>
  )
}
