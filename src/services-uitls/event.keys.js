module.exports = {
  'client': {
    'newMsg': 'send_message', /** 客户端发送的消息 */
    'getMsg': 'new_message_from_server', /** 接受服务端消息 */
    'getCode': 'qr_code_from_server', /** 获取登陆二维码 */
    'getFriendsInfo': 'contact_list_from_server',  /** 获取用户好友信息 */
    'loginSuccess': 'login_success_from_server', /** 登录成功 个人信息 */
    'getImgList': 'homework_img_from_server', /** 获取所有图片 */
    'addGroup': 'modify_favorite',  /** 发送添加分组消息 */
    'getAddResult': 'modify_favorite_result_from_server',  /** 接收添加分组结果消息 */
    'sendRequestForAvator': 'get_avatar_list',  /** 发送获取头像信息 */
    'getAvatorList': 'avatar_list_from_server'  /** 发送获取头像信息 */
  },
  'connect': {
    // 断开连接
    'disconnect': 'disconnect',
    // 接口错误
    'err_message': 'error_message_from_server'
  }
}
