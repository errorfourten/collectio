import routes from '@util/routes'
import express from 'express'
import errorMiddleware from '@middleware/errorMiddleware'
import mongoose from 'mongoose'
import common from '@util/common'

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

process.on('SIGINT', () => {
  mongoose.connection.close()
  console.log('Disconnected from MongoDB')
})

const app = express()

app.use(express.json())
app.use(routes)
app.use(errorMiddleware)

module.exports = app
