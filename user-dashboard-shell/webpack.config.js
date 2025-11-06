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
    port: 3000,
    historyApiFallback: true,
  },
  output: {
    // publicPath: 'auto',
    publicPath: 'http://localhost:3000/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.css', '.scss', '.sass'],
    alias: {
      shared: path.resolve (__dirname, '../shared'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: [
          path.resolve (__dirname, 'src'),
          path.resolve (__dirname, '../shared'),
        ],
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
      name: 'container',
      // expose a remoteEntry so other remotes can consume "container" at runtime
      filename: 'remoteEntry.js',
      remotes: {
        userList: 'userList@http://localhost:3001/remoteEntry.js',
        userDetails: 'userDetails@http://localhost:3002/remoteEntry.js',
      },
      exposes: {
        './shared': './src/sharedEntry',
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
        axios: {singleton: true},
        antd: {singleton: true},
      },
    }),
    new HtmlWebpackPlugin ({
      template: './public/index.html',
    }),
  ],
};
