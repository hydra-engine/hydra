const path = require('path')

module.exports = {
  entry: './index.ts',
  output: {
    filename: 'logic-worker.js',
    path: path.resolve(__dirname, '../')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
          }
        },
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  mode: 'development'
}
