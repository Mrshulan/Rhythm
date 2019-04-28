import PageModule from '../lib/Page.js'
import AudioManager from '../lib/AudioManager.js'

const $page = new PageModule({

  onPlayer(event) {
    const song = event.target.dataset.song
    const songs= event.currentTarget.dataset.songs
    // console.log(song)
    if(song) {
      AudioManager.setSong(song, songs)

      this.setData({
        playerSong: song,
        playerSongs: songs
      })
    }
  },

  onShow() {
    const data = AudioManager.getSong()
    this.setData(data)
  }
})

export default $page