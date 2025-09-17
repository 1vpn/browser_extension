var webpack = require('webpack'),
  path = require('path'),
  fs = require('fs-extra'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin'),
  Dotenv = require('dotenv-webpack'),
  { CleanWebpackPlugin } = require('clean-webpack-plugin'),
  ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'),
  ReactRefreshTypeScript = require('react-refresh-typescript'),
  merge = require('merge-json')

const ASSET_PATH = process.env.ASSET_PATH || '/'
const isDevelopment = process.env.NODE_ENV !== 'production'

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
  'mp4',
]

function combineManifests(commonConfigPath, browserSpecificConfigPath) {
  const commonConfig = JSON.parse(fs.readFileSync(commonConfigPath, 'utf8'))

  const browserSpecificConfig = JSON.parse(
    fs.readFileSync(browserSpecificConfigPath, 'utf8')
  )

  if (process.env.BROWSER === 'edge') {
    commonConfig.name = 'VPN'
    commonConfig.short_name = '1VPN'
    if (commonConfig.description) {
      commonConfig.description = '1VPN - ' + commonConfig.description
    }
  }

  return JSON.stringify(merge.merge(commonConfig, browserSpecificConfig))
}

var options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: path.join(__dirname, 'src', 'pages', 'popup', 'index.jsx'),
    background: path.join(__dirname, 'src', 'pages', 'background', 'index.js'),
    install: path.join(__dirname, 'src', 'pages', 'install', 'index.jsx'),
  },
  chromeExtensionBoilerplate: {
    notHotReload: ['background'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath: ASSET_PATH,
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        type: 'asset/resource',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(
                  Boolean
                ),
              }),
              transpileOnly: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          { loader: 'source-map-loader' },
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: fileExtensions
      .map((ext) => '.' + ext)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin({ overlay: false }),
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    new Dotenv({
      path: './.env',
      safe: false,
      systemvars: true,
      defaults: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest/base.json',
          to: path.join(__dirname, 'build/manifest.json'),
          force: true,
          transform: function (content, path) {
            return Buffer.from(
              combineManifests(
                'src/manifest/base.json',
                `src/manifest/${
                  process.env.BROWSER === 'firefox' ? 'firefox' : 'chrome'
                }.json`
              )
            )
          },
        },
        {
          from: 'src/assets/icon128.png',
          to: path.join(__dirname, 'build'),
          force: true,
        },
        {
          from: 'src/_locales',
          to: path.join(__dirname, 'build/_locales'),
          force: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'install', 'index.html'),
      filename: 'install.html',
      chunks: ['install'],
      cache: false,
    }),
  ].filter(Boolean),
  infrastructureLogging: {
    level: 'info',
  },
}

if (isDevelopment) {
  options.devtool = 'cheap-module-source-map'
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  }
}

module.exports = options
