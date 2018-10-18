import * as uitls from '../../uitls'
class MsgViewCxt {
  constructor () {
    this.to_user = null // 别人
    this.from_user = null
    this.db = window.openDatabase('recorddb', '1.0', 'Test DB', 10 * 1024 * 1024)
    // 插入数据
    this.insert = (obj) => {
      var keyStr = ''
      var valArr = []
      var setStr = ''
      for (var i in obj) {
        keyStr = keyStr + i + ','
        valArr.push(obj[i])
      }
      keyStr = keyStr.substr(0, keyStr.length - 1)
      for (var m = 0, len = valArr.length; m < len; m++) {
        if (m < len - 1) {
          setStr += '?,'
        } else {
          setStr += '?'
        }
      }
      this.db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS RECORD (' + keyStr + ')')
        tx.executeSql('INSERT INTO RECORD (' + keyStr + ') VALUES (' + setStr + ')', valArr)
      })
    }
    // 查表
    this.select = (key, value, argState) => {
      this.db.transaction(tx => {
        // console.log(`SELECT * FROM RECORD WHERE (${key[0]}  = '${value[0]}' and ${key[1]}  = '${value[1]}') OR (${key[0]} = '${value[1]}' and ${key[1]} = '${value[0]}')`)
        tx.executeSql(`SELECT * FROM RECORD WHERE (${key[0]}  = '${value[0]}' and ${key[1]}  = '${value[1]}') OR (${key[0]} = '${value[1]}' and ${key[1]} = '${value[0]}')`, [], (tx, results) => {
          console.log(Array.from(results.rows))
          argState.msgs = Array.from(results.rows)
        }, (tx, results) => {
          console.log(tx, results)
        })
      })
    }
    // 删除表
    this.delete = function () {
      this.db.transaction(function (tx) {
        tx.executeSql('DROP TABLE RECORD')
      })
    }
  }
  use (store) {
    this.initStore(store)
  }
  initStore (store) {
    let state = {
      msgs: [],
      userInfo: {},
      signalFriends: [],
      chat_to_user: null
    }
    let _this = this
    let getters = {
      [uitls.Keys.GETNEWMSG] (argState) {
        return argState.msgs
      },
      [uitls.Keys.SAVEUSERINFO] (argState) {
        return argState.userInfo
      },
      [uitls.Keys.SAVEFRIENDSINFO] (argState) {
        return argState.signalFriends
      },
      [uitls.Keys.GETCHATTO] (argState) {
        return argState.chat_to_user
      }
    }
    let mutations = {
      [uitls.Keys.ADDMSG] (argState, msg) {
        // _this.delete()
        if (msg.content !== '') {
          _this.insert(msg)
        }
        _this.select(['to_user', 'from_user'], [_this.to_user, _this.from_user], argState)
      },
      [uitls.Keys.SAVEUSERINFO] (argState, msg) {
        argState.userInfo = msg
      },
      [uitls.Keys.CLEARRECORD] (argState) {
        _this.delete()
      },
      [uitls.Keys.SAVEFRIENDSINFO] (argState, msg) {
        argState.signalFriends = msg
      },
      [uitls.Keys.GETTALKCACHE] (argState, msg) {
        let toUser = msg.to_user
        let fromUser = msg.from_user
        _this.from_user = msg.from_user
        _this.to_user = msg.to_user
        argState.chat_to_user = msg.to_user
        _this.select(['to_user', 'from_user'], [toUser, fromUser], argState)
      }
    }
    let actions = {
      [uitls.Keys.ADDMSG]: function (dis, msg) {
        dis.commit(uitls.Keys.ADDMSG, msg)
      },
      [uitls.Keys.SAVEUSERINFO]: function (dis, msg) {
        dis.commit(uitls.Keys.SAVEUSERINFO, msg)
      },
      [uitls.Keys.CLEARRECORD]: function (dis) {
        dis.commit(uitls.Keys.CLEARRECORD)
      },
      [uitls.Keys.SAVEFRIENDSINFO]: function (dis, msg) {
        dis.commit(uitls.Keys.SAVEFRIENDSINFO, msg)
      },
      [uitls.Keys.GETTALKCACHE]: function (dis, msg) {
        dis.commit(uitls.Keys.GETTALKCACHE, msg)
      }
    }
    store.state = uitls.merge(store.state, state)
    store.getters = uitls.merge(store.getters, getters)
    store.mutations = uitls.merge(store.mutations, mutations)
    store.actions = uitls.merge(store.actions, actions)
  }
}

export default MsgViewCxt
