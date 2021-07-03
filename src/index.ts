/* eslint-disable no-console */
/* eslint-disable import/first */

import dotenv from 'dotenv'

dotenv.config()
import common from '@util/common'
import { NextFunction, Request, Response } from 'express'
import serverApp from '@root/server'
import mongoose from 'mongoose'

const { PORT, inProduction } = common

require('module-alias/register')
const chokidar = require('chokidar')
const express = require('express')
const path = require('path')
require('express-async-errors')

const app = express()
app.use('/api', serverApp)

process.on('SIGINT', () => {
  console.log('KeyboardInterrupt detected')
  mongoose.connection.close()
  console.log('Disconnected from MongoDB')
  console.log('Exitting now...')
  process.exit(130)
})

// Use hot loading in backend
const watcher = chokidar.watch('src/server')
watcher.on('ready', () => {
  watcher.on('all', () => {
    Object.keys(require.cache).forEach((id) => {
      if (id.includes('server')) {
        delete require.cache[id]
      }
    })
  })
})

// Frontend: Hot loading in dev, else serve static
if (!inProduction) {
  /* eslint-disable */
  const webpack = require('webpack')
  const middleware = require('webpack-dev-middleware')
  const hotMiddleware = require('webpack-hot-middleware')
  const webpackConfig = require('@root/webpack.config')
  /* eslint-enable */
  const compiler = webpack(webpackConfig('development', { mode: 'development' }))

  const devMiddleware = middleware(compiler)
  app.use(devMiddleware)
  app.use(hotMiddleware(compiler))
  app.use('*', (_req: Request, res: Response, next: NextFunction) => {
    const filename = path.join(compiler.outputPath, 'index.html')
    devMiddleware.waitUntilValid(() => {
      compiler.outputFileSystem.readFile(filename, (err: Error, result: File) => {
        if (err) return next(err)
        res.set('content-type', 'text/html')
        res.send(result)
        return res.end()
      })
    })
  })
} else {
  const DIST_PATH = path.resolve('./dist')
  const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')

  app.use(express.static(DIST_PATH))
  app.get('*', (_req: Request, res: Response) => res.sendFile(INDEX_PATH))
}

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`)
})

export default app
