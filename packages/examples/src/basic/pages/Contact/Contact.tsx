import { SubPageFunction } from 'hd-web'

import { PageLayout } from '../../shared/PageLayout.js'
import { Form } from './Form.js'

export const Contact: SubPageFunction = () => ({
  title: 'Contact',
  body: () => (
    <PageLayout>
      <h1>Interactive contact page</h1>
      <Form />
    </PageLayout>
  )
})
