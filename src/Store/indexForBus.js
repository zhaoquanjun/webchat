/** 业务层与store的交互 */
import { getCxt } from '../services-client'
import MsgBusCxt from './msg/msgBusCxt'

class BusCxt {
  constructor () {
    this.servicesCxt = getCxt()
    this.msgCxt = new MsgBusCxt(this.servicesCxt)
  }
  init () {
    this.userCxt.init()
    this.msgCxt.init()
  }
}
export default BusCxt
