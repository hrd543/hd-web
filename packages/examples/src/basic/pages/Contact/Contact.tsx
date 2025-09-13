import { Page } from 'hd-web'

import { PageLayout } from '../../shared/PageLayout.js'
import { Form } from './Form.js'

export const Contact: Page = {
  title: 'Contact',
  content: () => (
    <PageLayout>
      <h1>Interactive contact page</h1>
      <Form />
    </PageLayout>
  )
}
