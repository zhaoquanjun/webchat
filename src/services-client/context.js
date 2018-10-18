
class Context {
  constructor (url, keys, io) {
    this.url = url
    this.io = io
    this.keys = keys
    this.vm = null
    this.socket = null
    this.to_user_name = null
    this.roomInfo = null
    this.from_user_name = null
    this.fromAvator = null
    this.toAvator = null
  }
  // 重置信息
  setInfo (to, from, toAvator, fromAvator) {
    this.to_user_name = to
    this.from_user_name = from
    this.fromAvator = fromAvator
    this.toAvator = toAvator
  }
  // 初始化 socket 建立连接
  createIo (vm) {
    this.vm = vm
    let socket = this.io.connect(this.url)
    this.socket = socket
  }
  getCode (callback) {
    this.socket.on(this.keys.client.getCode, (msg) => {
      callback(msg)
    })
  }
  loginSuccess (callback) {
    this.socket.on(this.keys.client.loginSuccess, (msg) => {
      callback(msg)
    })
  }
  getFriendsInfo (callback) {
    this.socket.on(this.keys.client.getFriendsInfo, (msg) => {
      callback(msg)
    })
  }
  getMsg (callback) {
    this.socket.on(this.keys.client.getMsg, (msg) => {
      callback(msg)
    })
  }
  getImgList (callback) {
    this.socket.on(this.keys.client.getImgList, (msg) => {
      console.log(msg)
      callback(msg)
    })
  }
  sendMsg (msg) {
    this.socket.emit(this.keys.client.newMsg, msg)
  }
  addGroup (msg) {
    this.socket.emit(this.keys.client.addGroup, msg)
  }
  getAddResult (callback) {
    this.socket.on(this.keys.client.getAddResult, msg => {
      callback(msg)
    })
  }
  sendRequestForAvator (msg) {
    this.socket.emit(this.keys.client.sendRequestForAvator, msg)
  }
  getAvatorList (callback) {
    this.socket.on(this.keys.client.getAvatorList, msg => {
      callback(msg)
    })
  }
  disconnect (callback) {
    this.socket.on(this.keys.connect.disconnect, (msg) => {
      callback(msg)
    })
  }
  error (callback) {
    this.socket.on(this.keys.connect.err_message, msg => {
      callback(msg)
    })
  }
}
export default Context
