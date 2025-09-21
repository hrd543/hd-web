import { View, Interactive } from 'hd-web'

import FormBehaviour from './Form.client.js'

export const Form: View = () => {
  return (
    <div>
      <label>Enter your name</label>
      {/* We can access this element inside our client via `refs` */}
      <input ref="input" />

      {/* 
        This means the `handleClick` method of your client
        component will be called on a "click" event
       */}
      <Interactive _use={FormBehaviour} _as="button" type="button">
        Click to log to console
      </Interactive>
    </div>
  )
}
