import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import MyBlog from '@/views/MyBlog'
import ContactWay from '@/views/ContactWay'
import BlogDetail from '@/views/BlogDetail'
import BlogControl from '@/views/BlogControl'
import MyPhoto from '@/views/MyPhoto'
Vue.use(Router)

export default new Router({
  mode:'history',
  base:'/blog',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/myBlog',
      name: 'MyBlog',
      component: MyBlog
    },
    {
      path: '/contactWay',
      name: 'ContactWay',
      component: ContactWay
    },
    {
      path: '/blogDetail',
      name: 'BlogDetail',
      component: BlogDetail
    },
    {
      path: '/blogControl',
      name: 'BlogControl',
      component: BlogControl
    },
    {
      path: '/myPhoto',
      name: 'myPhoto',
      component: MyPhoto
    }
  ]
})
