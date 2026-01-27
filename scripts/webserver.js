// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'
process.env.ASSET_PATH = '/'

const { execSync } = require('child_process')
try {
  execSync('node scripts/fetchFreeServers.js', { stdio: 'inherit', timeout: 5000 })
} catch (error) {
  console.log('Continuing server start...')
}

const port = 3000

var WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  path = require('path')

var options = config.chromeExtensionBoilerplate || {}
var excludeEntriesToHotReload = options.notHotReload || []

for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      'webpack/hot/dev-server',
      `webpack-dev-server/client?hot=true&hostname=localhost&port=${port}`,
    ].concat(config.entry[entryName])
  }
}

delete config.chromeExtensionBoilerplate

var compiler = webpack(config)

var server = new WebpackDevServer(
  {
    hot: true,
    liveReload: false,
    client: {
      webSocketTransport: 'sockjs',
    },
    webSocketServer: 'sockjs',
    host: 'localhost',
    port: port,
    static: {
      directory: path.join(__dirname, '../build'),
    },
    devMiddleware: {
      publicPath: `http://localhost:${port}/`,
      writeToDisk: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
  compiler
)

;(async () => {
  await server.start()
})()
