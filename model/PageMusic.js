import PageModule from '../lib/Page.js'
import AudioManager from '../lib/AudioManager.js'

// 全局背景音频对象
const audio = AudioManager.audio

const $page = new PageModule({
  data: {
    psongshow: false
  },

  onLoad(){},
  // 显示歌单
  showPsong() {
    this.setData({ psongshow: !this.data.psongshow })
  },
  // 删除歌单中的一条数据
  delPlayerSongs(event) {
    const song = event.currentTarget.dataset.song
    const index = this.data.playerSongs.findIndex(item => item.song)

    this.data.playerSongs.splice(index, 1)
    
    this.setData({
      playerSongs: this.data.playerSongs
    })
  },

  // 事件委托
  musicTap(event) {
    //需要触发的方法
    const method = event.target.dataset.method
    // AudioManager的static方法 songTab play 这些
    Reflect.has(AudioManager, method) && Reflect.apply(AudioManager[method], this, [event])
  },

  // 播放歌曲
  onPlayer(event) {
    const song = event.target.dataset.song
    const songs= event.currentTarget.dataset.songs
    // console.log(song)
    if(song) {
      AudioManager.setSong(song, songs)
      // this.setData({
      //   playerSong: song,
      //   playerSongs: songs
      // })
    }
  },

  onShow() {
    const audioEvents = ["onCanplay", "onWaiting", "onError", "onPlay", "onPause", "onSeeking", "onSeeked", "onEnded", "onStop", "onTimeUpdate", "onNext", "onPrev"];
    // 事件代理触发函数
    const trigger = e => {
      // this指向page实例
      Reflect.apply(audio[e], this, [(...arg) => {
        Reflect.has(this, e) && Reflect.apply(this[e], this, arg)
      }])
    }
    // 遍历这些事件 onCanplay 传入监听函数
    audioEvents.forEach(trigger)
    // 获取歌曲信息
    const data = AudioManager.getSong()
    this.setData(data)
  },
  // 更新音乐信息
  onTimeUpdate() {
    // 需要更新的数据
    const updata = {
      duration: audio.duration,
      currentTime: audio.currentTime,
      paused: audio.paused,
      buffered: audio.buffered
    }

    // 数据合并
    Object.assign(this.data.playerSong, updata)

    this.setData({
      playerSong: this.data.playerSong
    });
  },
  
  // 歌曲链接发生错误 
  onError() {
    wx.showToast({
      icon: 'none',
      title: '歌曲链接发生错误'
    })
  },
  // 播放结束,切换下一首
  onEnded() {
    AudioManager.songTab.call(this, true)
  }
})

export default $page