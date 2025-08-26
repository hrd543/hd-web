import { RequestHandler } from 'express'

export const formatHtmlRoutes: RequestHandler = (req, res, next) => {
  if (req.url.endsWith('index.html')) {
    req.url = req.url.slice(0, -10)
  } else if (req.url.endsWith('.html')) {
    req.url = req.url.slice(0, -5)
  }

  next()
}
