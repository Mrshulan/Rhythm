// 类的私有方法

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

  // 获取where函数
  static getWhere(action) {
    if(this.whereFn) {
      
      const whereFn = this.whereFn
      this.whereFn = null

      return whereFn
    } else {
      throw new Error(`调用${action}方法时，请先调用 where查询`)
    }
  }

  // 构建查询语句
  where(...args) {
    let [key, compare, value] = args

    if(/object/i.test(typeof key)) {
      for(let k in key) {
        if(Array.isArray(key[k])) {
          this.where(k, ...key[k])
        } else {
          this.where(k, key[k])
        }
      }

      return this
    }

    // 没有第三餐的时候 默认一二参 =
    if(value === undefined) {
      value = compare
      compare = '='
    }

    const compareFn = whereCompare[compare]

    if(compareFn) {
      //  //构建where 查询函数
      // this.whereFn = (item) => {
      //   return compareFn(item[key], value)
      // }

      //第一次进来构建where 查询函数
      if(!this.whereFn) {
        const whereFn = (item) => {
          let compareNum = 0

          whereFn.compare.forEach(compare => {
            compareNum += ~~compare.compareFn(item[compare.key], compare.value)
          })

          return compareNum === whereFn.compare.length
        }

        whereFn.compare = []
        //赋值到this
        this.whereFn = whereFn
      }

      //记录当前的对比条件
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
      throw new Error('add 方法接受对象对为参数')
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
      throw new Error("updata 仅接受对象参数");
    }

    return this;
  }
  // 查找一条数据
  find() {
    const db = Storage.getDb(this.dbname)
    this.sortFn && db.sort(this.sortFn);
    return db.find(Storage.getWhere.call(this, 'find'))
  }

  // 选择多个
  select() {
    // 拿到本地数据,缓存合并保存
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
    } else {
      --start
      end += start
    }

    this.sliceArg = [start, end]
    return this
  }


  // 将缓存更新到本地数据
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
      // console.log(db, "2")
    }
    // 更新本地缓存
    wx.setStorageSync(this.dbname, db)

    // 更新类的缓存
    this.cache = {
      add: {
        data: []
      }
    }

    return this
  }
}