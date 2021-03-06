module.exports = {
  entry: "./js/main.js",
  devtool: "source-map",
  output: {
    path: "./dist",
    filename: "bundle.js"
},
   module: {
   loaders: [
     {
       test: /\.js$/,
       exclude: /node_modules/,
       loader: 'babel-loader?presets[]=es2015&presets[]=react' }
   ]
 }
}
