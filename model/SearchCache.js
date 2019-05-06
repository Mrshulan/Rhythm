import Storage from '../lib/Storage.js'

const dbname = 'searchCache_db'

export default class SearchCache extends Storage {
  constructor() {
    super(dbname)
  }

  add(keyword) {
    if(!this.where('keyword', keyword).find()) {
      super.add({
        keyword,
        time: new Date().getTime()
      }).save()
    }
  }

  all() {
    this.order('time', 'desc')
    const db = super.all()
    const data = db.splice(0, 10)
    // 第十条之后就都删除
    db.forEach(item => {
      this.del(item.keyword)
    })

    return data
  }

  del(keyword) {
    this.where('keyword', keyword)
    super.del().save()
  }
}