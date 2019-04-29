import Event from './Event.js'

const app = getApp()

export default class PageModule extends Event {
  constructor (data) {
    super()

    const pageExample = this

    // this.oneEvent('onLoad', function () {
    //   Reflect.set(app, 'page', {
    //     example: pageExample,
    //     page: this,
    //     route: this.route
    //   })
    // })
    this.addEvent('onShow', function () {
      Reflect.set(app, 'page', {
        example: pageExample,
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


  // 导出实例
  exports(...arg) {
    arg = arg.length ? arg : Object.keys(this.events)

    const events = {}

    arg.forEach(eType => {
      if(/function/i.test(typeof this[eType])) {
        events[eType] = this[eType]
      } else {
        throw new Error(`不存在${eType}事件`)
      }
    })

    return events
  }

  // 导入
  extend(obj) {
    const { events, data } = PageModule.select(obj)
    // 添加事件
    for(let eType in events) {
      this.addEvent(eType, obj[eType])
    }
    // 添加属性
    Object.assign(this, data)
  }

  start(data) {
    data && this.extend(data)

    Page(this)
  }
}