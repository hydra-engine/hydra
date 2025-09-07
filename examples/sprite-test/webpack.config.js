const path = require('path')

module.exports = {
  entry: {
    'bundle': './index.ts',
    'logic-worker': './logic-worker/index.ts',
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
    extensions: ['.ts', '.js']
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