const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  entry: {
    'bundle': './index.ts',
    'logic-worker': './logic-worker/index.ts',
    'transform-worker': './transform-worker/index.ts',
    'render-worker': './render-worker/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './'),
    chunkFormat: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, "tsconfig.json") })],
  },
  devServer: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    client: {
      overlay: false,
      logging: 'none'
    },
    open: true
  }
}