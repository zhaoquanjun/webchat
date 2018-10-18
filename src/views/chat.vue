<template>
  <div class="chat-page clear">
    <ul class="user-info">
      <li class="user-avator"><img :src="saveUserInfo.avatar_url" alt=""></li>
      <li class="user-name">{{saveUserInfo.nickname}}</li>
      <li class="clear-record" @click="clearRecord">清空聊天记录</li>
    </ul>
    <div class="chat-container">
      <div class="left-slider">
        <div class="tit pos_t">班级群</div>
        <ul class="friends-list" >
          <li class="friend-item" v-for="(group, index) in group" :key="index" @click="handleGroup(group, index)" :class="{active: group.type == 1}">
            <span class="badge" v-if="newMsg_l[group.username] && newMsg_l[group.username].length > 0">{{newMsg_l[group.username].length}}</span>
            <span class="fri-avator"><img :src="avatorCollection[group.username]" alt=""></span>
            <span class="fri-name">{{group.remark_name ? group.remark_name.slice(0, 8) : group.nickname.slice(0, 8)}}</span>
          </li>
        </ul>
        <div class="tit pos_b" @click="showAllContacts">联系人</div>
        <div class="tit pos_t pos_t_r">成员</div>
        <ul class="chat-list" v-loading="contactLoading" element-loading-background="rgba(0, 0, 0, .1)" element-loading-text="联系人加载中...">
          <li class="chat-item" v-for="(user, index) in showLlist" :key="index" @click="handlePerson(user, index)" :class="{active: user.type == 1}">
            <span class="badge" v-if="newMsg_r[user.username] && newMsg_r[user.username].length > 0">{{newMsg_r[user.username].length}}</span>
            <span class="fri-avator"><img :src="avatorCollection[user.username]" alt=""></span>
            <span class="fri-name">{{user.remark_name ? user.remark_name.slice(0, 8) : user.nickname.slice(0, 8)}}<i class="el-icon-circle-plus" v-if="user.username.slice(0, 2) == isOperate" @click="add($event, index)"></i></span>
          </li>
        </ul>
        <div class="tit pos_b pos_b_r" @click="editor">{{operateText}}</div>
      </div>
      <div class="chat-content">
        <p class="chat-user tit">{{chatTarget.remark_name ? chatTarget.remark_name : chatTarget.nickname}}</p>
        <div class="msg-list">
          <msg-list :saveUserInfo="saveUserInfo" :avatorCollection="avatorCollection"/>
        </div>
        <div class="toolbar">
          <!-- <el-upload
           class="upload"
           action="#">
            <img src="../../static/images/sendPictBg.png" alt="" style="display: block; width: 30px; height: 20px;">
          </el-upload> -->
        </div>
        <div class="msg-input">
          <MsgWr :chatable="chatable" :saveUserInfo="saveUserInfo"/>
        </div>
      </div>
    </div>
     <div class="correct">
      <CorrectHea/>
      <CorrectCon :imgList="imgList" :signalFriends="signalFriends"></CorrectCon>
    </div>
  </div>
</template>

<script>
  import MsgList from '../components/Message/MsgList'
  import MsgWr from '../components/Message/MsgWriter'
  import CorrectHea from '../components/Correct/CorrectHea.vue'
  import CorrectCon from '../components/Correct/CorrectCon.vue'
  import { getCxt } from '../services-client'
  import { mapGetters } from 'vuex'
  import { getBusCxt } from '../store'
  import { Keys } from '../uitls'
  let saveUserInfo = Keys.SAVEUSERINFO
  export default {
    name: 'chat',
    data () {
      return {
        // 联系人列表
        group: [],
        // 所有联系人 列表
        allContacts: [],
        // 单个联系人
        signalFriends: [],
        // 显示列表 ---------------------------清空
        showLlist: [],
        // 聊天目标
        chatTarget: {name: '用户'},
        // 是否存在聊天对象
        chatable: false,
        // 添加分组按钮可操作性
        isOperate: 'editor',
        // 添加分组文案
        operateText: '编辑',
        // 联系人新消息数组
        newMsg_r: {},
        // 群组新消息数组
        newMsg_l: {},
        // 图片列表
        imgList: [],
        // 联系人loading
        contactLoading: true,
        // 当前选择群组索引
        curGroupIndex: null,
        // 头像请求索引
        avatorReqIndex: 30,
        // 群组头像请求列表
        groupReqList: [],
        // 全部请求头像列表
        friendAvatorReqList: [],
        // 头像存储对象
        avatorCollection: {},
        // 当前聊天对象
        curCommitUser: null,
        // 默认头像
        commonAvator: require('../../static/images/avator.jpg')
      }
    }, 
    mounted () {
      getBusCxt().msgCxt.getImgList(this.initImgList) // 初始化图片信息
      getBusCxt().msgCxt.getFriendsInfo(this.initGroupList) // 获取所有联系人列表信息
      getBusCxt().msgCxt.getMsg(this.getMsgFromServer) // 监听服务器消息
      getBusCxt().msgCxt.getAvatorList(this.getAvatorList) // 监听头像列表
    },
    components: {
      MsgList,
      MsgWr,
      CorrectHea,
      CorrectCon
    },
    computed: {
      ...mapGetters([saveUserInfo])
    },
    created() {
      this.clearRecord()
      if (!this.saveUserInfo) {
        this.$router.push('/')
      }
      console.log(this.saveUserInfo)
    },
    methods: {
      // 初始化联系人信息
      initGroupList (res) {
        // 服务端拿到数据，如果列表已经存在成员添加到群组进行渲染
        console.log(res)
        this.contactLoading = false
        this.signalFriends = Array.from(new Set(res.data.friends))
        getCxt().vm.$store.dispatch(Keys.SAVEFRIENDSINFO, this.signalFriends)
        this.allContacts = Array.from(new Set(res.data.friends))
        Array.from(new Set(res.data.groups)).map((it, i) => {
          if (it.is_favorite === 1) {
            this.group.push(it)
          } else {
            this.allContacts.unshift(it)
          }
          this.groupReqList.push(it.username)
        })
        this.showLlist = this.group[0] ? this.group[0].member_list : this.allContacts
        this.sendRequestForAvator(this.groupReqList)
        this.sendRequestForAvator(this.showLlist)
        // this.showLlist = this.allContacts
        this.group.map((it, i) => {
          this.newMsg_l[it.username] = {length: 0}
        })
        this.allContacts.map((it, i) => {
          this.newMsg_r[it.username] = {length: 0}
        })
      },
      // 初始化图片信息
      initImgList (res) {
        res.data.map((it, i) => {
          this.imgList.push(it)
        })
      },
      // 接受服务端消息
      getMsgFromServer (msg) {
        console.log(msg)
        // 消息提醒
        if (this.newMsg_l[msg.data.chat_to]) {
          msg.data.chat_to === this.curCommitUser ? this.newMsg_l[msg.data.chat_to].length = 0 : this.newMsg_l[msg.data.chat_to].length ++
        } else if (this.newMsg_r[msg.data.chat_to]) {
          msg.data.chat_to === this.curCommitUser ? this.newMsg_r[msg.data.chat_to].length = 0 : this.newMsg_r[msg.data.chat_to].length ++
        }
        // 抓取图片 ------------------------删除
        if (msg.data.type === 'image') {
          this.imgList.push({url: msg.data.content, nickname: msg.data.nickname})
        }
        // 存储消息
        let sender = null
        let avator = null
        if (msg.data.chat_to.slice(0, 2) === '@@') {
          // 定义发送者
          sender = msg.data.sender ? msg.data.sender : msg.data.from
          // 位置改变 
          this.group.map((it, i) => {
            if (it.username === msg.data.chat_to) {
              this.group.splice(i, 1)
              this.group.unshift(it)
              console.log(this.group)
            }
          })
        } else { 
          // 定义发送者
          sender = msg.data.from
          // 位置改变
          this.showLlist.map((it, i) => {
            if (it.username === msg.data.chat_to) {
              this.showLlist.splice(i, 1)
              this.showLlist.unshift(it)
            }
          })
        }
        avator = msg.data.chat_to === this.saveUserInfo.username ? this.saveUserInfo.avatar_url : this.avatorCollection[sender]
        let msg1 = {
          to_user: msg.data.to,
          from_user: msg.data.from,
          sender: sender,
          type: msg.data.type,
          owner: this.saveUserInfo.username,
          content: msg.data.content,
          avatar_url: avator
        }
        getCxt().vm.$store.dispatch(Keys.ADDMSG, msg1)
      },
      // 群组操作
      handleGroup (user, index) {
        if (this.isOperate === 'editor') {
          this.showLlist = this.group[index].member_list
          this.sendRequestForAvator(this.showLlist)
          this.chatTarget = user
          user.type = 1
          this.group.map((it, i) => { if (index !== i) { it.type = 0 } })
          this.showLlist.map((it, i) => { it.type = 0 })
          this.newMsg_l[user.username] ? this.newMsg_l[user.username].length = 0 : ''
        } else {
          this.$alert('请完成编辑状态再进行聊天操作！', '提示', {confirmButtonText: '确定'})
        }
        this.curCommitUser = user.username
        getCxt().setInfo(user.username, this.saveUserInfo.username, this.avatorCollection[user.username], this.saveUserInfo.avator_url)
        getCxt().vm.$store.dispatch(Keys.GETTALKCACHE, {from_user: this.saveUserInfo.username, to_user: user.username})
      },
      // 联系人操作
      handlePerson (user, index) {
        if (this.isOperate === 'editor') {
          this.chatTarget = user
          user.type = 1
          this.showLlist.map((it, i) => { if (i !== index) { it.type = 0 } })
          this.group.map((it, i) => { it.type = 0 })
          if (user.username.slice(0, 2) === '@@') {
            this.newMsg_l[user.username] ? this.newMsg_l[user.username].length = 0 : ''
          } else {
            this.newMsg_r[user.username] ? this.newMsg_r[user.username].length = 0 : ''
          }
        } else {
          this.$alert('请完成编辑状态再进行聊天操作！', '提示', {confirmButtonText: '确定'})
        }
        this.curCommitUser = user.username
        getCxt().setInfo(user.username, this.saveUserInfo.username, this.avatorCollection[user.username], this.saveUserInfo.avatar_url)
        getCxt().vm.$store.dispatch(Keys.GETTALKCACHE, {from_user: this.saveUserInfo.username, to_user: user.username})
      },
      // 本地图片
      sendPicture () {},
      // 点击编辑按钮
      editor () {
        this.showLlist = this.allContacts
        this.group.map((it, i) => { it.type = 0 })
        this.showLlist.map((it, i) => { it.type = 0 })
        if (this.isOperate === 'editor') {
          this.isOperate = '@@'
          this.operateText = '完成'
        } else if (this.isOperate === '@@') {
          this.isOperate = 'editor'
          this.operateText = '编辑'
        }
      },
      // 展示所有联系人
      showAllContacts () {
        this.showLlist = this.allContacts
        this.sendRequestForAvator(this.showLlist)
      },
      // 添加分组
      add (e, index) {
        e.cancelBubble = true
        e.stopPropagation()
        this.curGroupIndex = index
        let data = {
          modify: 'add',  // add--添加   del--删除
          type: 2,  // 1---好友   2---群
          nickname: this.showLlist[index].nickname,
          username: this.showLlist[index].username
        }
        getBusCxt().msgCxt.addGroup(data)
        getBusCxt().msgCxt.getAddResult(this.monitorAddResult) 
        
      },
      // 清空聊天记录
      clearRecord () {
        getCxt().vm.$store.dispatch(Keys.CLEARRECORD)
      },
      // 监听添加分组结果
      monitorAddResult (msg) {
        console.log(msg)
        if (msg.data.code === 0) {
          this.group.push(this.allContacts[this.curGroupIndex])
          this.allContacts.splice(this.curGroupIndex, 1)
          console.log(this.group)
        } else {
          this.$alert('添加失败了，请重新添加~', '提示', {confirmButtonText: '确定'})
        }
      },
      // 发送获取头像请求
      sendRequestForAvator (msg) {
        msg.map((it, i) => {
          if (this.avatorCollection[it.username] && this.avatorCollection[it.username] !== this.commonAvator) return
          this.friendAvatorReqList.push(it.username)
        })
        getBusCxt().msgCxt.sendRequestForAvator(this.friendAvatorReqList)
      },
      // 接受获取的头像列表
      getAvatorList (msg) {
        msg.data.map((it ,i) => {
          if (this.avatorCollection[it.username] && this.avatorCollection[it.username] !== this.commonAvator) return
          this.avatorCollection[it.username] = it.avatar_url ? it.avatar_url : this.commonAvator
        })
        console.log(this.avatorCollection)
      }
    },
    watch: {
      chatTarget () {
        if (this.chatTarget.nickname === '用户') {
          this.chatable = false
        } else {
          this.chatable = true
        }
      }
    }
  }
</script>
<style lang="less" scoped >
  .chat-page {
    display: inline-block;
    margin: 0 auto;
    min-width: 1505px;
    .user-info{
      height: 40px;
      li{
        float: left;
      }
      .user-avator{
        width: 30px;
        height: 30px;
        padding: 5px 10px 5px 0;
      }
      .user-name{
        height: 40px;
        line-height: 40px;
      }
      .clear-record{
        float: right;
        margin: 5px;
        padding: 0 5px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border-radius: 5px;
        font-size: 12px;
        border: 1px solid #888;
        cursor: pointer;
      }
    }
    .chat-container{
      float: left;
      margin: 0 auto;
      border-bottom: 1px solid #888;
      .left-slider{
        position: relative;
        float: left;
        .pos_b {
          width: 201px;
          position: absolute;
          bottom: 0;
          left: 0;
          border-top: 1px solid #888;
          z-index: 11;
          cursor: pointer;
        }
        .pos_b_r{
          left: 202px;
          width: 201px;
        }
        .pos_t{
          position: absolute;
          top: 0;
          left: 0;
          width: 201px;
          border-bottom: 1px solid #888;
          z-index: 11;
        }
        .pos_t_r{
          position: absolute;
          top: 0;
          left: 202px;
          width: 200.5px;
        }
        .friends-list{
          margin: 50px 0;
          width: 200px;
          height: 600px;
          float: left;
          overflow-y: scroll;
          border-left: 1px solid #888;
          .friend-item{
            position: relative;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: #fff;
            border-bottom: 1px solid #ddd;
            cursor: pointer;
            span{
              display: block;
              float: left;
            }
            .fri-avator{
              width: 30px;
              height: 30px;
              padding: 5px 5px 5px 10px;
            }
            .fri-name{
              width: 145px;
              height: 30px;
              line-height: 30px;
              text-align: left;
              padding: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .active{
            background: #ddd;
          }
          .pos_b {
            width: 200px;
            position: absolute;
            bottom: 0;
            left: 0;
          }
          .editer{
            width: 50%;
          }
        }
        .friends-list::-webkit-scrollbar {display:none}
        .chat-list{
          margin: 50px 0;
          width: 200px;
          height: 600px;
          float: left;
          overflow-y: scroll;
          .chat-item{
            position: relative;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: #fff;
            border-bottom: 1px solid #ddd;
            cursor: pointer;
            span{
              display: block;
              float: left;
            }
            .fri-avator{
              width: 30px;
              height: 30px;
              padding: 5px 5px 5px 10px;
            }
            .fri-name{
              width: 145px;
              height: 30px;
              line-height: 30px;
              text-align: left;
              padding: 5px;
            }
          }
          .active{
            background: #ddd;
          }
        }
        .chat-list::-webkit-scrollbar {display:none}
        ul{
          border-right: 1px solid #888;
        }
      }
      .chat-content{
        float: left;
        width: 500px;
        border-right: 1px solid #888;
        .msg-list {
          width: 100%;
          height: 504px;
          overflow-y: scroll;
        }
        .msg-input{
          height: 116px;
          width: 100%;
        }
        .msg-list::-webkit-scrollbar {display:none}
        .toolbar{
          height: 20px;
          padding: 5px;
          background: #ddd;
          .upload{
            width: 30px;
            height: 20px;
            cursor: pointer;
          }
        }
      }
    }
    .correct{
      float: left;
      width: 600px;
      overflow-y: scroll;
      border-right: 1px solid #999;
      border-bottom: 1px solid #999;
    }
    .correct::-webkit-scrollbar {display:none}
  }

</style>
<style>
  .badge {
    position: absolute;
    left: 35px;
    top: 3px;
    display: block;
    padding: 1px 4px;
    height: 15px;
    line-height: 16px;
    text-align: center;
    font-size: 10px;
    color: #fff;
    background: #f56c6c;
    border-radius: 6px;
  }
</style>
