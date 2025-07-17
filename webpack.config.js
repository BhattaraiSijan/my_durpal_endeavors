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
    },
    // FIX v2: Add a specific alias for the problematic import path.
    // This is a more direct way to tell webpack where to find this module,
    // which can be more effective than the byDependency rule.
    alias: {
      '@mui/material/styles': path.resolve(__dirname, 'node_modules/@mui/material/styles'),
    },
    // The original fix is kept as a fallback for other potential ESM issues.
    byDependency: {
      esm: {
        fullySpecified: false,
      },
    },
  },
};
