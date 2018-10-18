class Channel {
  constructor (id, socket, cxt) {
    this.socket = socket
    this.id = id
    this.user = null
    this.cxt = cxt
    this.room = null
  }
  static createChannel (id, socket, cxt) {
    return new Channel(id, socket, cxt)
  }
  setUser (user) {
    console.log(user)
    this.user = user
    this.socket.emit(this.cxt.eventKeys.emit.newUser, user)
    this.socket.to('roomId' + this.roomInfo.id).emit(this.cxt.eventKeys.emit.newUser, user)
  }
  init () {
    // let self = this
    // this.socket.on(this.cxt.eventKeys.client.newMsg, function (msg) { /** 发送消息 */
    //   self.notifyMsg(msg)
    //   console.log(msg)
    //   self.cxt.addMsg(msg)
    // })
    this.socket.on(this.cxt.eventKeys.client.closeConn, function () {
      console.log(self.id + '--关闭连接')
      self.cxt.remove(self)
    })
  }
  notifyMsg (msg) {
    msg.type = 'get'
    this.socket.emit(this.cxt.eventKeys.emit.notifyMsg, msg)
  }
}
module.exports = Channel
