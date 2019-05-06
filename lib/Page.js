import Event from './Event.js'

// 获取全局的app对象
const app = getApp()
console.log(app)
export default class PageModule extends Event {
  constructor (data) {
    super()
    const pageMoudleInstance = this
    // 此时用的是onShow 返回上级路由的时候重复赋值
    this.addEvent('onShow', function () {
      Reflect.set(app, 'page', {
        pageMoudleInstance,
        page: this,
        route: this.route
      })
    })

    data && this.extend(data)
  }

  // 筛选事件和属性
  static select(obj) {
    const events = {}
    const data = {}

    Object.keys(obj).forEach(key => {
      if(/function/i.test(typeof obj[key])) {
        events[key] = obj[key]
      } else {
        data[key] = obj[key]
      }
    })

    return { events, data }
  }

  // 导出page实例的方法
  exports(...arg) {
    arg = arg.length ? arg : Object.keys(this.events)

    const events = {}

    arg.forEach(eType => {
      if(/function/i.test(typeof this[eType])) {
        events[eType] = this[eType]
      } else {
        throw new Error(`该page不存在${eType}事件`)
      }
    })

    return events
  }

  // 导入page事件和属性
  extend(obj) {
    const { events, data } = PageModule.select(obj)
    // 添加事件
    for(let eType in events) {
      this.addEvent(eType, obj[eType])
    }
    // 添加属性
    Object.assign(this, data)
  }
  // 初始化 Page
  start(data) {
    data && this.extend(data)
    Page(this)
  }
}