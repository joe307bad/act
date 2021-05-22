const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, '/apps/web/src/main.tsx'),
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/typescript',
              '@babel/preset-react'
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              [
                '@babel/plugin-proposal-class-properties',
                { loose: true }
              ],
              [
                '@babel/plugin-transform-runtime',
                {
                  helpers: true,
                  regenerator: true
                }
              ]
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    // Re-generate index.html with injected script tag.
    // The injected script tag contains a src value of the
    // filename output defined above.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, '/apps/web/src/index.html')
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.join(__dirname, '/apps/web/tsconfig.json')
      }
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  resolve: {
    alias: {
      '@act/data': path.join(__dirname, '/libs/data/src'),
      '@act/wm/web': path.join(__dirname, '/libs/wm/web/src')
    },
    fallback: {
      fs: false
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  devServer: {
    contentBase: './dist'
  }
};
