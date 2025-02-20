import type {
  Request as CfRequest,
  Response as CfResponse,
  ExportedHandler
} from '@cloudflare/workers-types'
import { EmailOptions } from './types.js'

const addOriginHeader = (options: EmailOptions, response: Response) => {
  response.headers.set('Access-Control-Allow-Origin', options.url)
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-Email-Security, content-type'
  )
}

const getResponse = async (options: EmailOptions, request: CfRequest) => {
  // must have secret header in the request
  if (
    !request.headers.has('X-Email-Security') ||
    request.headers.get('X-Email-Security') !== options.password
  ) {
    return new Response('Unauthorised', { status: 401 })
  }

  // only allow post
  if (request.method !== 'POST') {
    return new Response('Only POST requests allowed', {
      status: 405
    })
  }

  const body = options.getEmailBody(await request.json())

  if (body.type === 'failure') {
    return new Response(body.detail, {
      status: 400
    })
  }

  return await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [options.to] }],
      from: options.from,
      subject: options.subject,
      content: [{ type: 'text/plain', value: body.detail }]
    })
  })
}

const getOptions = () => {
  return new Response(undefined, {
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  })
}

/**
 * Create a handler to be used to get a form POST request and send a notification
 * email to the given email address.
 *
 * Once created, this should be the default export in your function file.
 */
export const createEmailFunction = (options: EmailOptions): ExportedHandler => {
  return {
    fetch: async (request: CfRequest) => {
      const response =
        request.method === 'OPTIONS'
          ? getOptions()
          : await getResponse(options, request)

      addOriginHeader(options, response)

      return response as unknown as CfResponse
    }
  }
}
