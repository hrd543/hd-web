import type {
  Request as CfRequest,
  Response as CfResponse,
  PagesFunction,
  SendEmail
} from '@cloudflare/workers-types'
import { EmailOptions } from './types.js'
import { EmailMessage } from 'cloudflare:email'
import { createEmailRaw } from './createEmailRaw.js'

const emailSecretHeader = 'X-Email-Security'

type EmailEnv = {
  'contact-email': SendEmail
}

const getResponse = async (
  options: EmailOptions,
  request: CfRequest,
  env: EmailEnv
) => {
  // must have secret header in the request if password supplied.
  if (
    options.password &&
    (!request.headers.has(emailSecretHeader) ||
      request.headers.get(emailSecretHeader) !== options.password)
  ) {
    return new Response('Unauthorised', { status: 401 })
  }

  // only allow post
  if (request.method !== 'POST') {
    return new Response('Only POST requests allowed', {
      status: 405
    })
  }

  const body = await options.getEmailBody(request)

  if (body.type === 'failure') {
    return new Response(body.detail, {
      status: 400
    })
  }

  // Now create the email and try to send it
  try {
    // Our email must be bound via a binding named "contact-email"
    const email = new EmailMessage(
      options.from.email,
      options.to.email,
      createEmailRaw(options, body.detail)
    )

    await env['contact-email'].send(email)
  } catch (e: any) {
    const hasMessage = typeof e === 'object' && e && 'message' in e

    return new Response(
      hasMessage ? e.message : 'An error occurred, please try again',
      {
        status: 500
      }
    )
  }

  return new Response('Email sent successfully', { status: 200 })
}

const getOptions = () => {
  return new Response(undefined, {
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': `${emailSecretHeader}, content-type`
    }
  })
}

/**
 * Create a handler to be used to get a form POST request and send a notification
 * email to the given email address.
 *
 * Once created, this should be exported as `onRequest`.
 *
 * This requires a binding in your wrangler config file (named "contact-email")
 * See https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/
 */
export const createEmailFunction = (
  options: EmailOptions
): PagesFunction<EmailEnv> => {
  return async ({ request, env }) => {
    const response =
      request.method === 'OPTIONS'
        ? getOptions()
        : await getResponse(options, request, env)

    return response as unknown as CfResponse
  }
}
