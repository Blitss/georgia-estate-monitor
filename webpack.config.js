// webpack.config.js
const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/worker-entrypoint.ts'),
  target: 'webworker',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: false,
  mode: 'production',
  resolve: {
    fallback: {
      fs: false,
    },
    extensions: ['.ts', '.js'],
  },
  plugins: [new NodePolyfillPlugin()],
  performance: {
    hints: false,
  },
};
