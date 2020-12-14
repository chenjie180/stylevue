import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'
Vue.use(Router)


// export default new Router({
//   routes: [
//     {
//       path: '/login',
//       name: 'login',
//       component: Login
//     },
//     {
//       path: '/',
//       redirect: 'login'
//     },
//     {
//       path: '/home',
//       name: 'home',
//       component: Home
//     }
//   ]
// })

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [{path :'/Welcome',component: Welcome},
              {path :'/users',component: User}]

}

]
const router = new Router({
  routes
})
// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
