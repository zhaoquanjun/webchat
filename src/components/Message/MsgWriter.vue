<template>
    <div class="typeBox">
      <el-input resize="none" :disabled="!chatable" type="textarea" class="writeBox" v-model="content" :rows="5"  @keyup.enter.native="add"></el-input>
      <div class="tip" v-if="tipShow">不能发送空白信息<span></span></div>
      <div class="send-btn" >
        <el-button @click="add" :disabled="!chatable">发 送</el-button>
      </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Keys } from '../../uitls'
let getChatTo = Keys.GETCHATTO
import { getBusCxt } from '../../store'
export default {
  props: ['chatable', 'saveUserInfo'],
  name: 'MsgWriter',
  data () {
    return {
      db: '',
      content: '',
      tipShow: false,
      tipMsg: '不能发送空白信息'
    }
  },
  created () {},
  computed: {
    ...mapGetters([getChatTo])
  },
  methods: {
    add: function () {
      /* 组件 */
      this.content = this.content.replace(/\ +$/mg, '')
      this.content = this.content.replace(/[\r\n]$/mg, '')
      if (this.content) {
        console.log(this.getChatTo)
        let msg = {content: this.content, type: 'text', owner: this.saveUserInfo.username, sender: this.saveUserInfo.username, from_user: this.saveUserInfo.username, to_user: this.getChatTo, avator: this.saveUserInfo.avatar_url}
        getBusCxt().msgCxt.sendMsg(msg)
      } else {
        if (this.tipShow) {
          return
        } else {
          this.tipShow = true
          setTimeout(() => {
            this.tipShow = false
          }, 1000)
        }
      }
      this.content = ''
    }
  }
}

</script>
<style lang="less" scoped >
  .typeBox{
    width: 500px;
    height: 116px;
    position: relative;
    .writeBox{
      outline: none;
    }
    .tip{
      position: absolute;
      right: 10px;
      bottom: 50px;
      font-size: 12px;
      width: 110px;
      height: 25px;
      line-height: 27px;
      border-radius: 5px;
      background: #eee;
      span{
        position: absolute;
        right: 15px;
        bottom: -8px;
        display: block;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid #eee;
      }
    }
    .send-btn{
      position: absolute;
      right: 10px;
      bottom: 5px;
    }
  }
</style>
<style>
  .el-textarea__inner{
    border-radius: 0;
    outline: none;
    border: none;
  }
</style>
