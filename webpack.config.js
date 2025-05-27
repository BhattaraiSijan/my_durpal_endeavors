const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack'); 

module.exports = {
  entry: {
    'mdx-editor-build': './js/src/index.js',
    'mdx-renderer-build': './js/src/MDXRendererComponent.js', 
    'mdx-remote-build': './js/src/MDXRemoteRenderer.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'js/dist'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/[name].css',
    }),
    new Dotenv({
        path: './.env.local', 
        safe: true,          
        systemvars: true,     
        silent: true,         
        defaults: false       
      }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "stream": require.resolve("stream-browserify")
    }
  },
};
