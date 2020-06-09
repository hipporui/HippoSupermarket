import Vue from 'vue'
import VueRouter from 'vue-router'

//导入路由配置
import {routes} from './routes'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};


const router = new VueRouter({
  routes
})

export default router
