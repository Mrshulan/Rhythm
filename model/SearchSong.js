import Storage from '../lib/Storage.js'

const dbname = 'search_song'

export default class SearchSong extends Storage {
  constructor() {
    super(dbname)
  }

  add(songName) {
    if(!this.where('name', songName).find()) {
      super.add({
        name: songName,
        time: new Date().getTime()
      }).save()
    }
  }

  all() {
    this.order('time', 'desc')

    const db = super.all()

    const data = db.splice(0, 10)

    db.forEach(songItem => {
      this.del(songItem.name)
    })

    return data
  }


  del(songName) {
    this.where('name', songName)

    super.del().save()
  }
}