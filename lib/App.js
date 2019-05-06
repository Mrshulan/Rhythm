import Event from './Event.js'

// 刚开始app方法还没有被执行，所以getApp就会是个undefined
let app

export default class AppModule extends Event {

  globalData = {}

  pageData = {}

  constructor() {
    super()
  }

  // 给当前页面设置数据的, 通过assign代理直接给当前页设置
  static assign(key, val) {
    if (!app || !app.page) {
      return setTimeout(AppModule.assign.bind(null, key, val), 0);
    }

    // 拿到实际显示的页面的实例
    let page = app.page.page
    let kType = typeof key

    if(/string/i.test(kType) && val !== undefined) {
      page.setData({
        [key]: val
      })
    } else if (/object/i.test(kType)) {
      page.setData(key)
    }
  }

  // 获取/修改 全局数据
  data(...arg) {
    if(arg.length === 0) {
      return this.globalData
    } else if(arg.length === 1) {
      const kType = typeof arg[0]

      if(/string/i.test(kType)){
        return this.globalData[arg[0]]
      }

      if(/object/i.test(kType)) {
        const data = arg[0]
        for(let key in data) {
          this.data(key, data[key])
        }
      }
    } else if (arg.length === 2) {
      this.globalData[arg[0]] = arg[1]
    }
  }

  // 初始化方法
  start() {
    const appMouduleInstance = this

    // 监听app的加载事件(全局就一次) 注意里外的 this
    this.oneEvent('onLaunch', function () {
      Reflect.set(this, 'appMouduleInstance', appMouduleInstance)

      app = this // assign里边就可以拿到app.page.page appData pageData moduleInstance为所欲为
    })

    // App方法调用的时候接受一个对象,会通过浅拷贝的方式将数据添加到app方法里
    App(this)
  }
}
