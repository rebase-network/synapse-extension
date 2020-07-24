const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: {
    popup: path.join(__dirname, 'src/ui/index.tsx'),
    background: path.join(__dirname, 'src/background/index.ts'),
    contentScript: path.join(__dirname, 'src/contentScript/contentScript.ts'),
    injectedScript: path.join(__dirname, 'src/contentScript/inject/injectedScript.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin([
      // prettier-ignore
      {
        from: './src/manifest.json',
        to: path.join(__dirname, 'dist'),
      },
      {
        from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
        to: path.join(__dirname, 'dist/js'),
      },
      {
        from: './src/popup.html',
        to: path.join(__dirname, 'dist'),
      },
      {
        from: './src/notification.html',
        to: path.join(__dirname, 'dist'),
      },
      {
        from: './src/background.html',
        to: path.join(__dirname, 'dist'),
      },
      {
        from: './src/images/logo-32.png',
        to: path.join(__dirname, 'dist'),
      },
      {
        from: './src/images/logo-32.svg',
        to: path.join(__dirname, 'dist'),
      },
      {
        from: './src/images/logo-128.png',
        to: path.join(__dirname, 'dist'),
      },
    ]),
    new Dotenv(),
  ],
  module: {
    rules: [
      // prettier-ignore
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          // prettier-ignore
          {
            loader: 'style-loader', // Creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // Translates CSS into CommonJS
          },
          {
            loader: 'sass-loader', // Compiles Sass to CSS
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
  },
};