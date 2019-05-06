// 私有方法
const whereCompare = {
  '=': function (that, value) {
    return that === value
  },

  '!=': function (that, value) {
    return that != value
  },

  '>': function(that, value) {
    return that > value
  },

  '>=': function (that, value) {
    return that >= value
  },

  '<': function (that, value) {
    return that < value
  },

  '<=': function (that, value) {
    return that <= value
  },

  'like': function (that, value) {
    return new RegExp(value, 'i').test(that)
  }
}

export default class Storage {
  constructor(dbname) { 
    // 添加cache内存(默认存在add)
    Object.assign(this, {
      dbname,
      cache: {
        add: {
          data: []
        }
      }
    })
  }

  // 同步获取数据库中的数据
  static getDb(dbname) {
    return wx.getStorageSync(dbname) || []
  }

  // 获取where函数  del updata时候
  static getWhere(action) {
    if(this.whereFn) {      
      const whereFn = this.whereFn
      this.whereFn = null

      return whereFn
    } else {
      throw new Error(`调用${action}方法时，请先调用 where 构建查询`)
    }
  }

  // 构建查询语句
  where(...args) {
    let [key, compare, value] = args // where的时候提供的

    // 第一个参数如果是对象的话(方便合并处理where)
    if(/object/i.test(typeof key)) {
      for(let k in key) {
        if(Array.isArray(key[k])) {
          // 一二三餐
          this.where(k, ...key[k])
        } else {
          // 一二参
          this.where(k, key[k])
        }
      }

      return this
    }

    // 没有第三餐的时候 默认一二参 = del updata这些方法也就一惨
    if(value === undefined) {
      value = compare
      compare = '='
    }
    // 拿到比较方法函数
    const compareFn = whereCompare[compare]

    // 第一次进来构建where 查询函数
    if(compareFn) {
      // 基础版
      // this.whereFn = (item) => {
      //   return compareFn(item[key], value)
      // }

      if(!this.whereFn) {
        // item即是数据库里边的数组项了 通过where里边的规则进行筛选
        const whereFn = (item) => {
          let compareNum = 0

          whereFn.compare.forEach(compare => {
            compareNum += ~~compare.compareFn(item[compare.key], compare.value)
          })

          return compareNum === whereFn.compare.length
        }
        // 多次where的合并
        whereFn.compare = []
        // 赋值到this
        this.whereFn = whereFn
      }

      // 给compare数组添加条件
      this.whereFn.compare.push({
        key, value, compareFn
      })
    } else {
      throw new Error("where 不支持 " + compare + " 的对比方式")
    }

    return this
  }

  // 添加数据
  add(data) {
    if(Array.isArray(data)) {
      data.forEach(item => {
        this.add(item)
      })
    } else if(/object/.test(typeof data)) {
      this.cache.add.data.push(data)
    } else {
      throw new Error('add 方法接受对象(对象数组)参数')
    }

    return this
  }

  // 删除方法
  del() {
    this.cache.del = {
      where: Storage.getWhere.call(this, 'del')
    }

    return this
  }
  // 修改数据
  updata(data) {
    if(/object/i.test(typeof data)){
      this.cache.updata = {
        data,
        where: Storage.getWhere.call(this, 'updata')
      }
    } else {
      throw new Error("updata 仅接受对象参数")
    }

    return this
  }
  // 查找一条数据
  find() {
    const db = Storage.getDb(this.dbname) // 数组对象
    this.sortFn && db.sort(this.sortFn);
    return db.find(Storage.getWhere.call(this, 'find'))
  }

  // where过滤之后输出多个
  select() {
    // 拿到本地数据，过滤
    const db = Storage.getDb(this.dbname)
    const data = db.filter(Storage.getWhere.call(this, 'select'))

    this.sortFn && data.sort(this.sortFn)

    return this.sliceArg ? data.slice(...this.sliceArg) : data
  }

  // 查询所有数据
  all() {
    const data = Storage.getDb(this.dbname)
    
    this.sortFn && data.sort(this.sortFn)

    return this.sliceArg ? data.slice(...this.sliceArg) : data;
  }

  // 链式中间项
  // 排序
  order(key, sort='asc') {
    this.sortFn = (a, b) => {
      return /desc/i.test(sort) ? b[key] - a[key] : a[key] - b[key]
    }

    return this
  }

  // 数据截取
  limit(start, end) {
    if(end === undefined) {
      end = start
      start = 0
    }
    this.sliceArg = [start, end]
    return this
  }

  // 将cache内存 缓存更新到本地数据(小程序缓存)
  save() {
    let db = Storage.getDb(this.dbname)

    // 删除数据
    if(this.cache.del) {
      db = db.filter(item => {
        return !this.cache.del.where(item)
      })
    }
    // 更新数据
    if(this.cache.updata) {
      db.forEach(item => {
        if(this.cache.updata.where(item)) {
          Object.assign(item, this.cache.updata.data)
        }
      })
    }

    // 添加数据缓存
    if(this.cache.add){
      db.push(...this.cache.add.data)
    }

    // 更新本地缓存
    wx.setStorageSync(this.dbname, db)

    // 重新初始化默认cache
    this.cache = {
      add: {
        data: []
      }
    }

    return this
  }
}