<template>
  <div style="position: relative;">
    <ul class="correct-con"  v-loading="correctLoading" element-loading-background="rgba(0, 0, 0, .1)" element-loading-text="图片加载中...">
      <li v-for="(item, index) in imgList" :key="index" @click="correctTask(index)">
        <span>
          <img :src="item.url" alt="">
        </span>
        <span>{{item.nickname}}</span>
      </li>
    </ul>
    <div class="correct-mask" v-if="maskShow">
      <div class="close-icon" @click="closeMask">
        <img src="../../../static/images/close.png" alt="">
      </div>
      <div class="mask-l">
        <h3>{{imgList[curIndex].nickname}}</h3>
        <canvas id="canvas" width="370px" height="500px" class="l-task" @click="addflag($event)"></canvas>
      </div>
      <div class="mask-r">
        <div class="right_icon icon_my" @click="getflag(1)">
          <img :src="right" alt="">
        </div>
        <div class="error_icon icon_my" @click="getflag(0)">
          <img :src="error" alt="">
        </div>
        <el-button type="primary" class="send-btn" @click="sendPict">发 送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getBusCxt } from '../../store'
import { mapGetters } from 'vuex'
import { Keys } from '../../uitls'
let saveUserInfo = Keys.SAVEUSERINFO
let savaFriendsInfo = Keys.SAVEFRIENDSINFO
export default {
  props: ['imgList'], 
  data () {
    return {
      maskShow: false,
      right: require('../../../static/images/right.png'),
      error: require('../../../static/images/error.png'),
      flagImg: null,
      ctx: null,
      canvas: null,
      curIndex: null,
      correctLoading: true
    }
  },
  created () {
    setTimeout(() => {
      if (this.correctLoading) this.correctLoading = false
    }, 8000)
  },
  computed: {
    ...mapGetters([saveUserInfo]),
    ...mapGetters([savaFriendsInfo])
  },
  methods: {
    sendPict () {
      let image = new Image()
      let newImg = new Image()
      image.src = this.canvas.toDataURL('image/png')
      this.imgList[this.curIndex].url = image.src
      if (this.imgList.length === 1) {
        this.closeMask()
      } else {
        if (this.curIndex < this.imgList.length - 1) {
          this.curIndex ++
        } else {
          this.curIndex = 0
        }
      }
      newImg.src = this.imgList[this.curIndex].url
      this.ctx.clearRect(0, 0, 360, 500)
      this.ctx.drawImage(newImg, 0, 0, 360, 500)
      let to_user = null
      if (!this.savaFriendsInfo) {
        this.$alert('正在获取信息，请稍后操作', '提示', {confirmButtonText: '确定'})
      } else {
        console.log(this.imgList[this.curIndex].nickname)
        this.savaFriendsInfo.map((it, i) => {
          if (it.nickname === this.imgList[this.curIndex].nickname) {
            to_user = it.username
          }
        })
        if (!to_user) {
          this.$alert('没有找到好友~', '提示', {confirmButtonText: '确定'})
        }
      }
      console.log(to_user)
      let msg = {content: image.src, type: 'image', owner: this.saveUserInfo.username, to_user: to_user, from_user: this.saveUserInfo.username, sender: this.saveUserInfo.username, avator: this.saveUserInfo.avatar_url}
      getBusCxt().msgCxt.sendMsg(msg)
    },
    closeMask () {
      this.maskShow = false
      if (this.flagImg) {
        this.flagImg.src = ''
      }
    },
    correctTask (index) {
      this.maskShow = true
      this.curIndex = index
      this.$nextTick(() => {
        this.initCanvas(index)
      })
    },
    initCanvas (index) {
      this.canvas = document.getElementById('canvas')
      let img = new Image()
      img.src = this.imgList[index].url
      this.ctx = this.canvas.getContext('2d')
      this.ctx.globalCompositeOperation = "source-over"
      this.ctx.drawImage(img, 0, 0, 360, 500)
    },
    getflag (type) {
      this.flagImg = new Image()
      this.flagImg.src = type === 1 ? this.right : this.error
    },
    addflag (ev) {
      if (!this.flagImg) return
      let x = ev.offsetX
      let y = ev.offsetY
      this.ctx.drawImage(this.flagImg, x - 10 - (175 - x) / 15, y - 18, 20, 20)
    }
  }
}
</script>

<style lang="less" scoped>
  .correct-con{
    height: 650px;
    li{
      float: left;
      width: 93px;
      height: 144px;
      padding-left: 6px;
      padding-top: 8px;
      cursor: pointer;
      span{
        display: block;
      }
      span:first-of-type {
        width: 93px;
        height: 134px;
      }
      span:last-of-type {
        width: 93px;
        height: 20px;
        line-height: 20px;
        text-align: center;
      }
    }
  }
  .correct-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .8);
    .close-icon{
      width: 20px;
      height: 20px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
    .mask-l, .mask-r{
      width: 370px;
      height: 650px;
      float: left;
      h3{
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #fff;
        padding-top: 10px;
        text-align: center;
      }
      .l-task{
        width: 350px;
        height: 500px;
        padding: 10px;
      }
      .icon_my{
        padding: 10px;
        height: 130px;
        width: 130px;
      }
      .error_icon{
        padding-top: 75px;
      }
    }
    .mask-r{
      width: 150px;
      height: 470px;
      padding: 80px 40px;
    }

  }
</style>

<style>
  .send-btn{
    margin-top: 60px;
  }
  .send-btn span {
    padding: 12px 35px;
  }
</style>

