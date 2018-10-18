<template>
  <div class="login-page">
    <div class="login-content">
      <div class="login-code" id="code" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)" element-loading-text="登陆二维码加载中...">
        <img :src="codeSrc" alt="">
      </div>
      <p class="tip1">使用手机微信扫码登录</p>
      <p class="tip2">网页版微信需要配合手机使用</p>
    </div>
  </div>
</template>

<script>
import { getBusCxt } from '../store'
import { getCxt } from '../services-client'
import { Keys } from '../uitls'
export default {
  data () {
    return {
      loading: true,
      codeSrc: '',
      count: 0
    }
  },
  created () {
    this.addEvent()
  },
  methods: {
    getLoginCode (msg) {
      console.log(msg)
      this.count ++
      if (this.count > 1) {
        this.count --
        this.$router.push('/')
      }
      
      let code = msg.data.qr_code_url
      code ? this.showLoginCode(code) : ''
    },
    showLoginCode (src) {
      if (src) {
        this.codeSrc = src
        this.loading = false
      } else {
        this.loading = true
      }
    },
    loginIn (msg) {
      console.log(msg)
      if (msg.type === 'login_success') {
        this.count > 1 && this.count --
        getCxt().vm.$store.dispatch(Keys.SAVEUSERINFO, msg.data)
        this.$router.push('/chat')
      }
    },
    error (msg) {
      this.$alert(msg.data.code + msg.data.error_message, '提示', {confirmButtonText: '确定'})
    },
    disconnect () {
      this.$router.push('/')
    },
    addEvent () {
      getBusCxt().msgCxt.getCode(this.getLoginCode)
      getBusCxt().msgCxt.loginSuccess(this.loginIn)
      getBusCxt().msgCxt.disconnect(this.disconnect)
      getBusCxt().msgCxt.disconnect(this.error)
    }
  }
}
</script>

<style lang="less" scoped>
  .login-page{
    position: relative;
    .login-content{
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .login-code {
        margin: 0 auto;
        width: 180px;
        height: 180px;
      }
      .tip1{
        text-align: center;
        padding: 12px 0;
        font-weight: bold;
        font-size: 16px;
        margin: 0;
      }
      .tip2{
        font-size: 12px;
        color: #666;
        text-align: center;
      }
    }
  }
</style>

