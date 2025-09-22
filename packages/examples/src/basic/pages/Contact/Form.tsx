import { View, Enhance } from 'hd-web'

import FormBehaviour from './Form.client.js'

export const Form: View = () => {
  return (
    <Enhance.form with={FormBehaviour}>
      <label>Enter your name</label>
      {/* We can access this element inside our client via `refs` */}
      <input ref="input" />

      {/* 
        This means the `handleClick` method of your client
        component will be called on a "click" event
       */}
      <button ref="button" type="button">
        Click to log to console
      </button>
    </Enhance.form>
  )
}
