import routes from '@util/routes'
import express from 'express'
import errorMiddleware from '@middleware/errorMiddleware'

const app = express()

app.use(express.json())
app.use(routes)
app.use(errorMiddleware)

module.exports = app
