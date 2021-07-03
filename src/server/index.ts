/* eslint-disable no-console */
/* eslint-disable import/first */

import express from 'express'
import mongoose from 'mongoose'
import common from '@util/common'

// Initialises MongoDB schemas
import '@models/dataset'
import '@models/project'

mongoose
  .connect(common.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error.message)
  })

import routes from '@util/routes'
import errorMiddleware from '@middleware/errorMiddleware'

const app = express()

app.use(express.json())
app.use(routes)
app.use(errorMiddleware)

export default app
