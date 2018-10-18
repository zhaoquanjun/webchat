import Vue from 'vue'
import Router from 'vue-router'

import Chat from './views/chat.vue'
import Login from './views/login.vue'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/chat',
      component: Chat
    }
  ]
})

export default router
