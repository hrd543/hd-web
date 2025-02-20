export type EmailOptions = {
  /** The url of your site, including https */
  url: string
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
  /** A secret key sent as a header to verify the request came from your site. */
  password: string
  /**
   * Given the form options sent to the worker as a request,
   * get the content of the email or flag any errors.
   */
  getEmailBody: (body: any) => { type: 'success' | 'failure'; detail: string }
}
