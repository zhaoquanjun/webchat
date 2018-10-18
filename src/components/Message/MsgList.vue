<template> 
    <div class="clear" ref="chatBox">
        <ul class="msg-cont">
            <li v-for="(item, index) in getNewMsg" :key="index" class="clear" >
              <span class="message-container" v-if="item.sender === saveUserInfo.username"  :class="{ 'msg-cont-send': item.sender === saveUserInfo.username }">
                <span class="msg-cont-item" v-if="item.type === 'text'">{{item.content}}</span>
                <span class="img-message" v-else-if="item.type === 'image'">
                  <img :src="item.content" alt="">
                </span>
                <span class="user-avator"><img :src="item.avatar_url" alt=""></span>
              </span>
              <span class="message-container" v-else :class="{ 'msg-cont-receive': item.sender !== saveUserInfo.username}">
                <span class="user-avator"><img :src="item.avatar_url" alt=""></span>
                <span class="msg-cont-item" v-if="item.type === 'text'">{{item.content}}</span>
                <span class="img-message" v-else-if="item.type === 'image'">
                  <img :src="item.content" alt="">
                </span>
              </span>
            </li>
        </ul>
    </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Keys } from '../../uitls'
  let recKey = Keys.GETNEWMSG
  export default{
    props: ['saveUserInfo', 'avatorCollection'],
    name: 'MsgList',
    data () {
      return {}
    },
    created () {
      // this.getNewMsg.push({avatar_url: "../../../static/images/user.jpg", content: "敖德萨大所", create_time: '1539076977746', from_user_name: "@4987984654", msg_type: 'img', to_user_name: "@@0988989", src: '../../../static/images/task_05.jpg'})
    },
    computed: {
      ...mapGetters([recKey])
    },
    watch: {
      getNewMsg () {
        let chatH = this.$refs.chatBox.scrollHeight
        if (chatH > 458) {
          this.$refs.chatBox.scrollIntoView(false)
        }
      }
    }
  }
</script>
<style lang="scss" scoped >
    .msg-cont{
        list-style-type: none;
        margin: 0px;
        padding-bottom: 38px;
        float: right;
    }
    .msg-cont > li{
        margin: 0px;
        margin-bottom: 8px;
    }
    .message-container {
        display: block;
        width: 490px;
        padding: 5px;
    }
    .msg-cont-item{
        display: inline-block;
        vertical-align: middle;
        background: #ddd;
        padding: 5px 10px; 
        border-radius: 3px;
        margin-right: 10px;
        max-width: 250px;
        text-align: left;
        word-wrap:break-word;
    }
    .img-message{
      display: inline-block;
      padding: 5px 10px; 
      vertical-align: top;
      width: 170px;
    }
    .img-message img{
      width: 100%;
      height: 100%;
    }
    .user-avator{
        display: inline-block;
        vertical-align: middle;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
    .msg-cont-receive{
        text-align: left;
    }
    .msg-cont-send{
        text-align: right;
    }
    .other {
      float: left;
    }
</style>