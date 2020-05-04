const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

/**
 * Main function to generate webpack config.
 */
const createWebpackConfig = async () => {
  return {
    entry: {
      base: path.resolve('src/base.js')
    },
    output: { 
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      path: path.resolve('dist'), // Where to find assets
      publicPath: '/' // Where to serve assets
    },
    plugins: [
      new MiniCssExtractPlugin()
    ],
    resolve: {
      modules: [path.resolve(__dirname, '../../node_modules'), 'node_modules'],
      alias: {
        src: path.resolve('src/'),
        pages: path.resolve('src/pages/'),
        components: path.resolve('src/components/'),
        services: path.resolve('src/services/'),
        styles: path.resolve('src/styles/'),
        utils: path.resolve('src/utils/'),
        assets: path.resolve('src/assets/')
      }
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-optional-chaining'
              ]
            }
          }
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            interpolate: true
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif|ico)$/,
          use: [
            { 
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                esModule: false
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            { 
              loader: 'file-loader',
              options: {
                name: '[name].[ext]'
              }
            }
          ]
        }
      ]
    }
  }
}

module.exports = createWebpackConfig;