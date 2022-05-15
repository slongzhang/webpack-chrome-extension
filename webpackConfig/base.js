const path = require('path')
const webpack = require('webpack')
const rootPath = path.resolve(__dirname, '../'); // 定义项目根目录


const htmlWebpackPlugin = require('html-webpack-plugin') // 模板替换
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin') // 提取公共模块

const CopyWebpackPlugin = require("copy-webpack-plugin") // 文件拷贝插件

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
  module: {
    rules: [{
        test: /\.css$/,
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|jpeg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            // fallback: { // 回调函数，file-loader 可以写在回调里，也可忽略，webpack会自动查找处理
            //   loader: 'file-loader',
            //   options: {
            //     publicPath: './dist/'
            //   }
            // }
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/, // 过滤目录
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.css', '.vue'], // 省略的后缀
    alias: {
      "@src": rootPath + '/src',
      "@options": path.resolve(rootPath, '/src/options'),
      "@popup": path.resolve(rootPath, '/src/popup'),
      "vue$": "vue/dist/vue.esm.js"
    }
  },
  plugins: [
    // 提取公共部分
    new CommonsChunkPlugin({
      // 从 指定的现成的 Chunk 中提取公共的部分
      chunks: ['options', 'popup'], // 从options和popup文件抽取
      // 把公共的部分放到 base 中
      name: 'common'
    }),
    // 导出options
    new htmlWebpackPlugin({
      template: 'index.html',
      filename: 'options/index.html',
      // title: '',
      //增加指定的chunks
      chunks: ['common', 'options']
    }),
    // 导出popup
    new htmlWebpackPlugin({
      template: 'index.html',
      filename: 'popup/index.html',
      // title: '',
      //增加指定的chunks
      chunks: ['common', 'popup']
    }),
    // banner声明条
    new webpack.BannerPlugin(`
    author: 'slongZhang',
    email: 'slongzhang@qq.com',
    date: ${new Date().toDateString()}`),
    // 拷贝文件
    new CopyWebpackPlugin([{
        from: path.resolve(rootPath, "src/crxConfig/assets"),
        to: path.resolve(rootPath, "dist/assets")
      },
      {
        from: manifestFile,
        to: path.resolve(rootPath, "dist/manifest.json")
      },
    ])
  ]
}