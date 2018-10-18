<template>
  <div id="container">  
    <div class="cont">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import { Keys } from './uitls'
// import { getBusCxt } from './store'

// let currRoom = Keys.GETROOMINFO

export default {
  name: 'app'
  // computed: {
  //   ...mapGetters([currRoom])
  // },
  // methods: {
  //   loginOut: function () {
  //     getBusCxt().userCxt.closeConn()
  //     window.close()
  //   }
  // }
}
</script>

<style lang="less" >
  #container {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
