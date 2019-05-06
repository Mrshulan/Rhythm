import AudioManager from '../lib/AudioManager.js'
import { request } from '../common/const.js'

export default class Banner {

  constructor(page) {
    // 挂载到页面实例上
    Reflect.set(page, 'actionBanner', Banner.actionBanner)
  }

  static actionBanner(event) {
    const action = event.currentTarget.dataset.action
    wx.showModal({
      title: '接口通知',
      content: "请从浏览器打开" + action.linkUrl,
    })
  }

  getBanner() {
    return new Promise((resolve) => {
      wx.request({
        url: request.recommend,
        success: resolve
      })
    })
  }
}