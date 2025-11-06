const HtmlWebpackPlugin = require ('html-webpack-plugin');
const ModuleFederationPlugin = require ('webpack/lib/container/ModuleFederationPlugin');
const path = require ('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  // Enable source maps for easier debugging in development
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port: 3001,
    historyApiFallback: true,
  },
  output: {
    // publicPath: 'auto',
    publicPath: 'http://localhost:3001/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.css', '.scss', '.sass'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            // ensure babel outputs inline source maps that webpack can consume
            sourceMaps: true,
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin ({
      name: 'userList',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
      },
      remotes: {
        container: 'container@http://localhost:3000/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: '19.2.0',
        },
        'react-dom': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '19.2.0',
        },
        'react-router-dom': {singleton: true},
        antd: {singleton: true},
        axios: {singleton: true},
      },
    }),
    new HtmlWebpackPlugin ({
      template: './public/index.html',
    }),
  ],
};
