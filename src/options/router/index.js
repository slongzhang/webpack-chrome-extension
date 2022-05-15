// 配置路由相关信息
import VueRouter from 'vue-router'
import Vue from 'vue'

// 1.通过Vue.use(插件)，安装插件
Vue.use(VueRouter)

// 导入组件
import Home from '../views/Home'
import About from '../views/About'

// 2.创建VueRouter对象
const routes = [{
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  }, {
    path: '/about',
    component: About
  }
]
const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
