import Storage from '../lib/Storage.js'

const dbname = 'like_song'

export default class LikeSong extends Storage {
  constructor() {
    super(dbname)
  }

  has(mid) {
    return this.where('songmid', mid).find() ? true : false;
  }

  add(song) {
    const dataKey = ["songurl", "songmid", "songname", "singer", "album_min", "album_big", "albummid", "albumname"];
    const data = {}

    dataKey.forEach(key => data[key] = song[key]);

    super.add(Object.assign({
      time: new Date().getTime()
    }, data)).save()

  }

  del(song) {
    this.where('songmid', song.song_mid)
    super.del().save()  
  }
}