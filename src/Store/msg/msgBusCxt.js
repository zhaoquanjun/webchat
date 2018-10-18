import { Keys } from '../../uitls'
class MsgBusCxt {
  constructor (cxt) {
    this.cxt = cxt
  }
  init () {
    let self = this
    this.cxt.reciveMsg(function (msg) {
      self.cxt.vm.$store.dispatch(Keys.ADDMSG, msg)
    })
  }
  getCode (callback) {
    this.cxt.getCode(callback)
  }
  loginSuccess (callback) {
    this.cxt.loginSuccess(callback)
  }
  // getUserInfo (callback) {
  //   this.cxt.getUserInfo(callback)
  // }
  getFriendsInfo (callback) {
    this.cxt.getFriendsInfo(callback)
  }
  getMsg (callback) {
    this.cxt.getMsg(callback)
  }
  getImgList (callback) {
    this.cxt.getImgList(callback)
  }
  sendMsg (msg) {
    console.log(msg)
    let msg1 = {
      avatar_url: msg.avator,
      content: msg.content,
      from_user: msg.from_user,
      owner: msg.owner,
      sender: msg.from_user,
      to_user: msg.to_user,
      type: msg.type
    }
    let sendData = {
      type: 'send_message',
      data: {
        to: msg.to_user,
        content: msg.content,
        type: msg.type
      }
    }
    this.cxt.vm.$store.dispatch(Keys.ADDMSG, msg1)
    this.cxt.sendMsg(sendData)
  }
  addGroup (msg) {
    let sendData = {
      type: 'modify_favorite',
      data: msg
    }
    this.cxt.addGroup(sendData)
  }
  getAddResult (callback) {
    this.cxt.getAddResult(callback)
  }
  sendRequestForAvator (msg) {
    let sendData = {
      type: 'get_avatar_list',
      data: {
        username_list: msg
      }
    }
    this.cxt.sendRequestForAvator(sendData)
  }
  getAvatorList (callback) {
    this.cxt.getAvatorList(callback)
  }
  disconnect (callback) {
    this.cxt.disconnect(callback)
  }
  error (callback) {
    this.cxt.error(callback)
  }

}
export default MsgBusCxt
