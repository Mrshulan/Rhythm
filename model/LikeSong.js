import Storage from '../lib/Storage.js'

const dbname = 'like_song'

export default class LikeSong extends Storage {
  constructor() {
    super(dbname)
  }

  has(mid) {
    return this.where('song_mid', mid).find() ? true : false;
  }

  add(song) {
    const dataKey = ["song_url", "song_mid", "song_name", "song_orig", "album_min", "album_big", "album_mid", "album_name"];
    const data = {}

    dataKey.forEach(key => data[key] = song[key]);

    super.add(Object.assign({
      time: new Date().getTime()
    }, data)).save()

  }

  del(song) {
    this.where('song_mid', song.song_mid)
    super.del().save()  
  }
}