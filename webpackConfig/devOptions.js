const baseConfig = require('./base.js');
const path = require('path')
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(baseConfig, {
  devServer: {
    contentBase: path.resolve(__dirname, "../dist/options/"),
    inline: true
  }
});
