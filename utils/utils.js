import Storage from '../lib/Storage.js'
// 对象转url参数
function objDeUCode(obj) {
  return Object.keys(obj).map(item => item + '=' + encodeURIComponent(obj[item])).join('&')
}

function getUserInfo() {
  const $app = getApp().appMouduleInstance

  return new Promise((resolve, reject) => {
    let userInfo = $app.data('userInfo')

    if(userInfo) {
      return resolve(userInfo)
    }

    const $user_db = new Storage('user_db')

    userInfo = $user_db.where('time', '!=', '').find()

    if(userInfo) {
      $app.data(userInfo) 
      return resolve(userInfo)
    }

    wx.getUserInfo({
      success(res) {
        console.log(res)
        resolve(res.userInfo)
      },
      fail() {
        wx.redirectTo({
          url: '/pages/start/index',
        })
      }
    })
  })
}

// 发送一个http的get请求
function httpGet(url, uData) {
  const db = new Storage('http_get')
  const deUrl = url + '?' + objDeUCode(uData)
  const data = db.where('url', deUrl).find()

  if (data && new Date(data.time).getDate() > new Date().getDate()) {
    return new Promise(resolve => {
      resolve(data.data)
    })
  } else {
    return new Promise((resovle, reject) => {
      wx.request({
        url: deUrl,
        success: (res) => {
          // 添加到本地
          db.add({
            data: res,
            url: deUrl,
            time: new Date().getTime()
          }).save()

          resolve(res)
        },
        fali: reject
      })     
    })
  }
}

export default {
  httpGet,
  objDeUCode,
  getUserInfo
}