// import '../node_modules/bootstrap/dist/css/bootstrap.css'
import Vue from 'vue'
import ElemUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import * as stores from './store'
import { getCxt } from './services-client'
import 'babel-polyfill'

import '../static/base.css'
// let initRoomInfo = Keys.SETROOMINFO
Vue.use(ElemUi)
/* eslint-disable no-new */
new Vue({
  store: stores.default,
  router,
  render: h => h(App),
  created: function () {
    // let self = this
    getCxt().createIo(this, () => {
      stores.busCxt.init() /** 初始化view与service层的交互层(业务层) */
      // self.$store.dispatch(initRoomInfo, roomInfo)
      // getCxt().refUsers(function (users) {
      //   stores.busCxt.userCxt.refUsers(users)
      // })
    })
  }
}).$mount('#app')
