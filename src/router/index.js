import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Taskinfo from '@/components/Taskinfo'
import Listslide from '@/components/listslide'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: 'Login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Taskinfo/:id',
      name: 'Taskinfo',
      component: Taskinfo
    },
    {
      path: '/listslide',
      name: 'Listslide',
      component: Listslide
    }

  ]
})
