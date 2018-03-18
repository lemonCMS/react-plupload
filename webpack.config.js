module.exports = {
  mode: 'development',
  entry: [
    './example/Example.js'
  ],
  output: {
    path: __dirname + '/dist',
    publicPath: '/assets',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: '.'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
};
