# webpack-chrome-extension

## 初始化项目

```bash
npm init
```

## 安装webpack@3.6

```bash
npm install --save-dev webpack@3.6
```

## 创建开发目录

```bash
# windows cmd下执行
md src, src\background, src\contentScripts, src\options, src\popup, src\config, src\crxConfig\assets\images

# window powerShell下执行
mkdir -p src, src/background, src/contentScripts, src/options, src/popup, src/config, src/crxConfig/assets/images

# 其他平台自行创建
```

## 创建开发基础文件

```bash
# cmd
echo console.log('This is background.js')>src\background\index.js
echo console.log('This is contentScripts.js injected here')>>src\contentScripts\index.js
echo console.log('This is options.js')>src\options\main.js
echo console.log('This is popup.js')>src\popup\main.js
type nul>src\config\config.js

# powerShell
new-item src/background/index.js -type file -force -value "console.log('This is background.js')"
new-item src/contentScripts/index.js -type file -force -value "console.log('This is contentScripts.js injected here')"
new-item src/options/main.js -type file -force -value "console.log('This is options.js')"
new-item src/popup/main.js -type file -force -value "console.log('This is popup.js')"
new-item src/config/config.js
```

## 创建开发配置config/config.js

```js
const config = {
    home: 'https://www.slong.ink',
    plugin: 'https://local.plugin.slong.ink',
    pluginApi: 'https://local.plugin.slong.ink/crx',
    prefix: '__ZSL__'
}
export default config
```

## 创建html页面模板

-   根目录下新建index.html

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta name="author" content="slongzhang@qq.com">
      <title>webpack-chrome-extension</title>
    </head>
    <body>
      <div id="app">
      </div>
    </body>
    </html>
    ```




## 配置webpack.config

### 创建webpack.config所需文件

- 根目录下新建webpackConfig文件夹，并创建base.js 、build.js、dev.js、devOptions.js

```bash
# cmd
mkdir webpackConfig
type nul>webpackConfig\base.js
type nul>webpackConfig\build.js
type nul>webpackConfig\dev.js
type nul>webpackConfig\devOptions.js

# powerShell
mkdir webpackConfig
new-item webpackConfig/base.js
new-item webpackConfig/build.js
new-item webpackConfig/dev.js
new-item webpackConfig/devOptions.js
```

### 配置base.js

```js
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
```


### 配置build.js

```js
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

```


### 配置dev.js

```js
const baseConfig = require('./base.js');
module.exports = baseConfig

```



### 配置devOptions.js

```js
const baseConfig = require('./base.js');
const path = require('path')
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(baseConfig, {
  devServer: {
    contentBase: path.resolve(__dirname, "../dist/options/"),
    inline: true
  }
});

```
