import myArray from './MyArray.js'

export default class Event {
  constructor() {
    // 保存事件队列
    Object.defineProperty(this, 'events', {
      value: {},
      enumerable: false
    })
  }

  // 创建队列触发器
  static createEventHandle(eType, that) {
    Reflect.set(that, eType, function(...arg) {
      const page = this
      const data = []

      if (eType === 'onLoad') {
        const argData = arg[0];
        Object.keys(argData).forEach(key => {
          // onLoad 事件传递的数据对象需要反解码
          argData[key] = decodeURIComponent(argData[key]);
        });
      } 

      // 拿到一波队列 下面统一执行
      const eTypeFn = Array.from(Reflect.get(that.events, eType))
      // 一次性触发队列 返回data[{nameSpace: ,data: }]
      ;(function recur() {
        const f = eTypeFn.shift()

        f && data.pushNameSpace(f.apply(page, arg))

        eTypeFn.length && recur()
      })()

      return data
    })
  }

  // 获取事件队列
  getEvent(eType) {
    let eTypeFn = Reflect.get(this.events, eType)

    // 是否已经安排上队列了
    if(!Array.isArray(eTypeFn)) {
      eTypeFn = []
      Reflect.set(this.events, eType, eTypeFn)
      // == this.events[eType] = eTypeFn;
      // 创造一个eType触发器 一次执行队列
      Event.createEventHandle(eType, this)
    }

    return eTypeFn
  }

  // 添加事件
  addEvent(eType, callback) {
    const eTypeFn = this.getEvent(eType)
    eTypeFn.push(callback)
  } 

  // 移除事件
  removeEvent(eType, callback) {
    // 指定清除
    if(callback) {
      const eTypeFn = this.getEvent(eType) 
      const index = eTypeFn.findIndex(item => item === callback)

      index !== -1 && eTypeFn.splice(index, 1)
    // 置空eType队列 
    } else {
      Reflect.set(this.events, eType, [])
    }
  }

  // 一次性事件
  oneEvent(eType, callback) {
    const that = this
    const handle = function(...arg) {
      // 修正this
      callback.apply(this, arg)
      that.removeEvent(eType, handle)
    }

    this.addEvent(eType, handle)
  }
}