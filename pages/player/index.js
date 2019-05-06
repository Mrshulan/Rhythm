import pageModule from '../../lib/Page.js'
import $AudioPlayer from '../../model/AudioPlayer.js'
import AudioManager from "../../lib/AudioManager.js"
import FavoriteCache from "../../model/FavoriteCache.js"
import { request } from "../../common/const.js"

const audio = AudioManager.audio

// 获取云端评论控制权(文档集合型)
const db = wx.cloud.database()
const Comments = db.collection('Comments')

// 拿到收藏歌单的本地储存
const $favoriteCache_db = new FavoriteCache();

const $page = new pageModule({
  // 加载
  onLoad(o) {
    wx.setNavigationBarTitle({
      title: o.name || ''
    })

    //收藏状态
    this.setData({
      isLike: $favoriteCache_db.has(o.mid)
    });

    this.getLyrics(o.mid)
    this.getCommentCount(o.mid)
  },
  onShow() {
    if (this.data.playerSong) {
      this.getCommentCount(this.data.playerSong.songmid)
    }
  },
  // 获取评论数
  getCommentCount(mid) {
    Comments.where({
      'songmid': mid
    }).get().then(res => {
      this.setData({
        commentCount: res.data.length
      })
    })

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
    // console.log('下一首链接请求成功之后')
    // 设置导航标题
    wx.setNavigationBarTitle({
      title: this.data.playerSong.songname
    });
    // 收藏状态
    this.setData({
      isLike: $favoriteCache_db.has(this.data.playerSong.songmid)
    });
    // 评论个数
    this.getCommentCount(this.data.playerSong.songmid)
    // 重新获取歌词
    this.getLyrics(this.data.playerSong.songmid)
  }
})

$page.extend($AudioPlayer)

$page.start()
