require('dotenv').config()
require('module-alias/register')
const chokidar = require('chokidar')
const express = require('express')
const path = require('path')
require('express-async-errors')

const { PORT, inProduction } = require('@util/common')

const app = express()

app.use('/api', (req, res, next) => require('@root/server')(req, res, next)) // eslint-disable-line

// Use hot loading in backend
const watcher = chokidar.watch('.src/server')
watcher.on('ready', () => {
  watcher.on('all', () => {
    Object.keys(require.cache).forEach((id) => {
      if (id.includes('server')) delete require.cache[id]
    })
  })
})

// Frontend: Hot loading in dev, else serve static
if (!inProduction) {
  /* eslint-disable */
  const webpack = require('webpack')
  const middleware = require('webpack-dev-middleware')
  const hotMiddleware = require('webpack-hot-middleware')
  const webpackConfig = require('@root/webpack.config.js')
  /* eslint-enable */
  const compiler = webpack(webpackConfig('development', { mode: 'development' }))

  const devMiddleware = middleware(compiler)
  app.use(devMiddleware)
  app.use(hotMiddleware(compiler))
  app.use('*', (req, res, next) => {
    const filename = path.join(compiler.outputPath, 'index.html')
    devMiddleware.waitUntilValid(() => {
      compiler.outputFileSystem.readFile(filename, (err, result) => {
        if (err) return next(err)
        res.set('content-type', 'text/html')
        res.send(result)
        return res.end()
      })
    })
  })
} else {
  const DIST_PATH = path.resolve(__dirname, './dist')
  const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')

  app.use(express.static(DIST_PATH))
  app.get('*', (req, res) => res.sendFile(INDEX_PATH))
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on port ${PORT}`)
})
