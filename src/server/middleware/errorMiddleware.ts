import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(error.message, error.name, error.extra)

  res.status(500).send({ error: error.message })
  return next(error)
}

export default errorHandler
