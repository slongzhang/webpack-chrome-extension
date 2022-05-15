module.exports = {
  // 插件开发规范版本
  "manifest_version": 3,
  // 插件名
  "name": "webpack dev chrome extension MV3",
  // 插件版本号
  "version": "1.0.1",
  // 插件描述
  "description": "a chrome extension with webpack@3.6",
  // 选项页
  "options_page": "options/index.html",
  // 浏览器右上角图标设置，V3:action(V2:browser_action、page_action、app必选三选一)
  "action": {
    // // 扩展显示的图标(位于浏览器右上角)
    // "default_icon": "assets/images/icon48.png",
    // 鼠标悬停在图标时显示的标题
    "default_title": "webpack dev chrome extension MV3",
    // 点击后的页面
    "default_popup": "popup/index.html"
  },
  // // 图标
  // "icons": {
  //   "16": "assets/images/icon16.png",
  //   "48": "assets/images/icon48.png",
  //   "128": "assets/images/icon128.png"
  // },
  // 常驻后台js或后台页面
  "background": {
    "service_worker": "background/index.js"
  },
  // 权限申请
  "permissions": [
    "tabs",
    // 插件本地存储
    "storage",
    // 获取cookie权限
    "cookies",
    // 定时器
    "alarms",
    // 脚本注入功能
    "scripting"
    // 请求头拦截与修改
    , 'webRequest', 'declarativeNetRequest'
  ],
  // 主机域名权限（可以通过executeScript或者insertCSS访问的网站）
  "host_permissions": [
    "*://*/*"
  ],
  // 允许web与bg通信的域名（注意这里不支持泛域名）
  "externally_connectable": {
    "matches": [
      "*://*.slong.ink/*",
      // 百度(平时调试使用)
      "*://*.baidu.com/*"
    ]
  },
  // 注入到页面的脚本
  "content_scripts": [{
    "matches": [
      // "*://*.baidu.com/*", // 匹配百度
      // "http://*/*", // 匹配所有http开头的
      // "https://*/*", // 匹配所有https开头的
      "<all_urls>" // 匹配所有
    ],
    "js": ["contentScripts/index.js"],
    "css": [],
    "run_at": "document_start" // 什么时候执行注入，"document_start"页面打开注入
  }],
  // 定义可以被外部访问的文件资源(当前插件的文件资源如图片，脚本，样式等)
  "web_accessible_resources": [

  ],
  // 插件主页
  "homepage_url": "https://www.slong.ink",
  // 更新地址
  "update_url": "https://clients2.google.com/service/update2/crx"
}
