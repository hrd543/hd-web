import { EmailOptions } from './types.js'

const getProp = (name: string, value: string) => `${name}: ${value}`

const getDate = () => new Date().toUTCString().replace(/GMT|UTC/gi, '+0000')

const getEmail = ({ name, email }: { name: string; email: string }) =>
  `"${name}" <${email}>`

const defaults = [
  getProp('MIME-Version', '1.0'),
  getProp('Content-Type', 'text/plain; charset=UTF-8')
]

/**
 * Convert the given email options into a format which can be consumed
 * by the cloudflare EmailMessage class.
 *
 * See https://www.npmjs.com/package/mimetext
 */
export const createEmailRaw = (options: EmailOptions, content: string) => {
  return [
    getProp('Date', getDate()),
    getProp('From', getEmail(options.from)),
    getProp('To', getEmail(options.to)),
    getProp('Subject', options.subject),
    ...defaults,
    // Add a line before the content
    '',
    content
  ].join('\n')
}
