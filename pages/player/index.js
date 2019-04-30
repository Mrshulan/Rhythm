import pageModule from '../../lib/Page.js'
import $pagemusic from '../../model/PageMusic.js'
import AudioManager from "../../lib/AudioManager.js"
import { request } from "../../common/const.js"

const audio = AudioManager.audio

const $page = new pageModule({
  data: {
    multiple: 8,
    duration: 150,
    current: 0,
    currentIndex: 0
  },
  // showPsong() {
  //   this.setData({
  //     psongstatu: !this.data.psongstatu
  //   })
  // }
  // 加载
  onLoad(o) {
    wx.setNavigationBarTitle({
      title: o.name || ''
    })

    this.getLyrics(o.mid)
  },
  // 获取歌词
  getLyrics(mid) {
    const url = request.lyrics + mid

    new Promise((resolve, reject) => {
      wx.request({
        url,
        success: resolve,
        fail: reject
      })
    }).then(res => {
      let lyrics = res.data.lyric
      if (lyrics === undefined) {
        lyrics = [{
          milisecond: 0,
          second: 0,
          date: "00:00.00", 
          text: "暂时无歌词"
        }]
      } else if (lyrics.length === 1) {
        this.setData({ multiple: 1 })      
      } else {
        this.setData({ multiple: 8 })
      }
      this.setData({lyrics})
    })
  },
  // 设置进度条
  setSeek(event) {
    const time = event.detail.value

    AudioManager.trigger('seek', this, time)
  },
  // 进度条更新时间
  onTimeUpdate() {
    if(!this.data.lyrics || !this.data.lyrics.length) {
      return false
    }
    let currentTime = ~~(audio.currentTime * 1000)
    let currentIndex = this.data.lyrics.findIndex(item => item.millisecond > currentTime)

    if (currentTime >= this.data.lyrics[this.data.lyrics.length - 1].millisecond) {
      currentIndex = this.data.lyrics.length - 1
    } else {
      --currentIndex
    }

    currentIndex = Math.max(0, currentIndex)

    let current = Math.max(0, currentIndex - ~~(this.data.multiple / 2))
    // 判断歌词是否到了最后一页
    current = Math.min(current, this.data.lyrics.length - this.data.multiple)

    this.setData({ current, currentIndex })  
  },
  
  //每次切换歌曲都会触发准备就绪的回调函数
  onCanplay() {
    //设置导航标题
    wx.setNavigationBarTitle({
      title: this.data.playerSong.song_name
    });
    // 重新获取歌词
    this.getLyrics(this.data.playerSong.song_mid)
  }
})

$page.extend($pagemusic)
$page.start()
