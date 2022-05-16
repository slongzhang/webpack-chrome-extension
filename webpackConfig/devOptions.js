// const baseConfig = require('./base.js');
// const path = require('path')
// const webpackMerge = require('webpack-merge');
//
// module.exports = webpackMerge(baseConfig, {
//   devServer: {
//     contentBase: path.resolve(__dirname, "../dist/options/"),
//     inline: true
//   }
// });

const path = require('path');
const rootPath = path.resolve(__dirname, '../'); // 定义项目根目录
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

const {
  _module,
  _resolve,
  _plugins
} = require('./common');

module.exports = {
  entry: path.resolve(__dirname, '../src/options/main.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
  },
  module: _module,
  resolve: _resolve,
  plugins: [
    new htmlWebpackPlugin({
      template: './index.html'
    }),
    _plugins.banner()
  ],
  devServer: {
    contentBase: './dist',
    inline: true,
    // historyApiFallback: {
    //     index: "/" // 由于使用了vue-router，而且路由模式是 history 模式，需要服务端做兜底处理，即将任何找不到的页面重定向到 index.html
    // },
    historyApiFallback: true // https://www.jianshu.com/p/d0024d6ddedb
  }
};
