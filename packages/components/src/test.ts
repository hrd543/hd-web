import { initialiseGlobals } from '../../create/globals.js'
//@ts-ignore
import fs from 'fs'

initialiseGlobals()

// @ts-ignore
import('../dist/index.js').then((exports) => {
  const Header = exports.Header
  const html = Header({
    items: [{ link: '#abc', title: 'abc' }],
    logo: 'JD Logs'
  })

  fs.writeFile('./index.html', html || '', () => {})
})
