const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package.json');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  output: {
    filename: 'react-realtime.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'reactRealtime',
    libraryTarget: 'umd',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  externals: Object.keys(pkg.peerDependencies || {}),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
