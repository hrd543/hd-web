import { JSX } from '@hd-web/jsx'
import {
  Header,
  ToastEvent,
  ToastProvider,
  WebComponent
} from '../dist/index.js'

class Button extends WebComponent {
  static get _key() {
    return 'my-button' as const
  }

  handleEvent() {
    console.log('clicking')
    document.dispatchEvent(
      new ToastEvent({
        eventType: 'add',
        type: 'default',
        message: 'yoyoyo',
        duration: 6e3
      })
    )
  }

  connectedCallback() {
    this.addEventListener('click', this.handleEvent.bind(this))
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleEvent.bind(this))
  }
}

const App: JSX.FuncComponent = () => (
  <>
    <Header logo="Henry" items={[{ link: '#key', title: 'Key' }]} />
    {/* <ToastProvider.key />
    <Button.key>click me</Button.key> */}
  </>
)

export default App
