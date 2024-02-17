const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: './src/main.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'app.js' // Output bundle file
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js' // Alias to use full build of Vue
    },
    extensions: ['*', '.js', '.vue', '.json'] // Resolve these extensions
  },
  plugins: [
    new VueLoaderPlugin() // Use VueLoaderPlugin to handle Vue components
  ]
}
