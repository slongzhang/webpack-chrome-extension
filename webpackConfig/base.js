const path = require('path')
const webpack = require('webpack')
const rootPath = path.resolve(__dirname, '../'); // 定义项目根目录

const {
  _module,
  _resolve,
  _plugins
} = require('./common');

// 判断打包的版本
let manifestVersion = process.env.npm_config_MV;
if (manifestVersion && trim(manifestVersion) == 2) {
  manifestVersion = 2;
} else {
  manifestVersion = 3;
}

// 处理manifest文件(因为压缩的manifest.json不便查看和修改，json文件也无法注释， 因此改用js文件来转换)
// 获取fs句柄
const fs = require('fs')
// 获取manifest内容
const manifestData = require(`../src/crxConfig/manifest.v${manifestVersion}.js`)
const manifestFile = path.resolve(rootPath, `src/crxConfig/manifest.min.json`)
// 写入数据
fs.writeFileSync(manifestFile, JSON.stringify(manifestData));


module.exports = {
  entry: {
    background: path.resolve(rootPath, 'src/background/index.js'),
    contentScripts: path.resolve(rootPath, 'src/contentScripts/index.js'),
    options: path.resolve(rootPath, 'src/options/main.js'),
    popup: path.resolve(rootPath, 'src/popup/main.js'),
  },
  output: {
    path: path.resolve(rootPath, 'dist'),
    filename: '[name]/index.js'
  },
  module: _module,
  plugins: [
    // 提取公共部分
    _plugins.chunkCommon(),
    // 导出options
    _plugins.optionsTemplate(),
    // 导出popup
    _plugins.popupTemplate(),
    // banner声明条
    _plugins.banner(),
    // 拷贝文件
    _plugins.copy(manifestFile)
  ],
  resolve: _resolve
}
