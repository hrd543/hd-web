import { Request as CfRequest } from '@cloudflare/workers-types'

export type EmailOptions = {
  /**
   * The url of the site making the request.
   *
   * Can leave blank if you're requesting from your site.
   */
  url?: string
  /**
   * The details of who the email notification is from.
   *
   * E.g., mailbox@example.com
   */
  from: {
    name: string
    email: string
  }
  /**
   * The details of who the email notification should be sent to.
   *
   * E.g., myPersonalMail@gmail.com
   */
  to: {
    name: string
    email: string
  }
  /** The subject of the email */
  subject: string
  /**
   * A secret key sent as a header to verify the request came from your site.
   *
   * Uses the emailSecretHeader header to do so.
   *
   * This is a very minimal security benefit but tries to make sure people only
   * make the request via the form.
   */
  password?: string
  /**
   * Given the request sent to the worker,
   * get the content of the email or flag any errors.
   */
  getEmailBody: (
    request: CfRequest
  ) => Promise<{ type: 'success' | 'failure'; detail: string }>
}
