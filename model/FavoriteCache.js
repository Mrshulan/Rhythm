import Storage from '../lib/Storage.js'

const dbname = 'favoriteCache_db'

export default class LikeSong extends Storage {
  constructor() {
    super(dbname)
  }
  // 判断歌曲是否在喜欢列表里边
  has(mid) {
    return this.where('songmid', mid).find() ? true : false
  }
  // 添加喜欢歌曲
  add(song) {
    const dataKey = ["songurl", "songmid", "songname", "singer", "album_min", "album_big", "albummid", "albumname"]
    const data = {}
    // 适配到data里边
    dataKey.forEach(key => data[key] = song[key])
    // 添加本地缓存
    super.add(Object.assign({
      time: new Date().getTime()
    }, data)).save()

  }
  // 删除喜欢歌曲
  del(song) {
    this.where('songmid', song.songmid)
    super.del().save()  
  }
}