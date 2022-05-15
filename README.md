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
