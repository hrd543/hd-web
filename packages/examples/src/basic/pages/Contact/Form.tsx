import { FuncComponent, registerClient } from 'hd-web'

import FormClient from './Form.client.js'

export const Form: FuncComponent = () => {
  return (
    <div>
      <label>Enter your name</label>
      {/* We can access this element inside our client via `refs` */}
      <input ref="input" />

      {/* 
        This means the `handleClick` method of your client
        component will be called on a "click" event
       */}
      <button type="button" $click="handleClick">
        Click to log to console
      </button>
    </div>
  )
}

registerClient(Form, FormClient)
