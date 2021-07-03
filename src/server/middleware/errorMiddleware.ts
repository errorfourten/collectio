import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(error.message, error.name, error.extra)

  switch (error.name) {
    case 'CastError': {
      return res.status(400).send({ error: 'Malformatted id' })
    }
    case 'NotFoundError': {
      return res.status(404).send({ error: error.message })
    }
    case 'UserInputError': {
      return res.status(400).send({ error: error.message })
    }
    default: res.status(500).send({ error: error.message })
  }

  return next(error)
}

export default errorHandler
