import AppModule from '../lib/App.js'
import Storage from '../lib/Storage.js'

const $audio_db = new Storage('audio_db')
const audio = wx.getBackgroundAudioManager()

export default class AudioManager{
  static audio = audio
  static song = null
  static songs = null

  static setSong(song, songs) {
    const audioAttr = {
      src: 'http://117.21.183.13/amobile.music.tc.qq.com/C400002Aascs1YJ5IW.m4a?guid=8253071150&vkey=0F751BE5466E7282CED9451B40FA1AE7E2BC9E84C1E762808AB38FEDE91256AB2E1705774789AAE5AD36D55BA305CE2AF8730B6080D7C12D&uin=0&fromtag=66',
      title: song.song_name,
      epname: song.album_name,
      singer: song.song_orig,
      coverImgUrl: song.album_min
    }
    // console.log(audioAttr)
    AudioManager.saveSong(song, songs)

    Object.assign(audio, audioAttr)
  }

  static getSong() {
    const data = {
      song: {},
      songs: []
    }

    Object.keys(data).forEach(key => {
      if(AudioManager[key]) {
        data[key] = AudioManager[key]
      } else {
        const keyData = $audio_db.where('type', key).find()

        if(keyData) {
          data[key] = keyData.data
        }
      }
    })

    return {
      playerSong: data.song,
      playerSongs: data.songs
    };
  }

  static saveSong(song, songs) {
    const data = { song, songs }

    Object.assign(AudioManager, data)

    Object.keys(data).forEach(key => {
      const where = { 'type': key }

      const upData = Object.assign({}, where, {
        data: data[key],
        time: new Date().getTime()
      })

      if($audio_db.where(where).find()) {
        $audio_db.where(where).updata(upData)
      } else {
        $audio_db.add(upData)
      }

      $audio_db.save();

    })
  }

  //构造方法
  constructor() { }
}