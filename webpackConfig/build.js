const baseConfig = require('./base.js');
const path = require('path')
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin') // 清除上次打包的dist
const ZipPlugin = require("zip-webpack-plugin") // 打包压缩插件

module.exports = webpackMerge({
    plugins: [
      // 清除旧的dish
      new CleanWebpackPlugin(),
      // 丑化压缩代码
      new uglifyjsWebpackPlugin()
    ]
  },
  baseConfig, {
    plugins: [
      // 压缩打包
      new ZipPlugin({
        path: path.resolve(__dirname, "../dist"),
        filename: 'dist.zip'
      })
    ]
  })
