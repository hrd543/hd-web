import { FuncComponent, registerClient } from 'hd-web'

import FormClient from './Form.client.js'

export const Form: FuncComponent = () => {
  return (
    <div>
      <label>Enter your name</label>
      <input ref="input" />

      <button type="button" $click="handleClick">
        Click to log to console
      </button>
    </div>
  )
}

registerClient(Form, FormClient)
