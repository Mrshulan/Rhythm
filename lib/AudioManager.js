import AppModule from '../lib/App.js'
import Storage from '../lib/Storage.js'
import LikeSong from "../model/LikeSong.js"
import utils from '../utils/utils.js'
import { request } from '../common/const.js'

// 音频本地缓存
const $audio_db = new Storage('audio_db')
// 收藏歌单的本地存储
const $like_db = new LikeSong()
// 全局唯一的背景播放器
const audio = wx.getBackgroundAudioManager()

// 管理全局唯一的背景音频播放器
export default class AudioManager{
  // 使用静态变量保存，方便后续的代码的引入
  static audio = audio
  // 当前播放的音乐
  static song = null
  // 当前播放的歌单
  static songs = null
  // 设置当前播放的歌单/歌曲
  static setSong(song, songs) {
    // 播放器的属性
    const audioAttr = {
      src: song.songurl,
      title: song.songname,
      epname: song.albumname,
      singer: song.singer,
      coverImgUrl: song.albummin
    }
    // console.log(audioAttr)
    // 添加页面上
    AudioManager.saveSong(song, songs)
    //设置到 audio 播放器上,如果设置了src,会自动播放
    Object.assign(audio, audioAttr)
  }
  // 获取歌曲数据
  static getSong() {
    // 歌曲/歌单
    const data = {
      song: {},
      songs: []
    }
    // 遍历
    Object.keys(data).forEach(key => {
      // 从管理器static上获取
      if(AudioManager[key]) {
        data[key] = AudioManager[key]
      } else {
        // 从本地获取数据
        const keyData = $audio_db.where('type', key).find()
        // 用户第一次进来肯定是没有数据的
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

  // 保存当前歌曲状态
  static saveSong(song, songs) {
    // 需要保存的数据
    const data = { song, songs };
    // 保存保存到类上
    Object.assign(AudioManager, data);
    // 更新到app页面上
    AppModule.assign({
      playerSong: song,
      playerSongs: songs
    })
    
    // 本地数据库保存一波
    // 遍历需要保存的数据
    Object.keys(data).forEach(key => {
      // 保存的类型
      const where = { 'type': key }
      // 保存的数据
      const upData = Object.assign({}, where, {
        data: data[key],
        time: new Date().getTime()
      })

      // 判断是否为修改或者新增
      if($audio_db.where(where).find()) {
        $audio_db.where(where).updata(upData)
      } else {
        $audio_db.add(upData)
      }

      // 保存到本地
      $audio_db.save();
    })
  }

/*============= 通过页面代理触发的函数 this指向页面实例 =============*/
  // audio 事件行为代理触发
  static trigger(eType, that, ...arg) {
    //验证是否存在方法名 如果存在就执行
    Reflect.has(audio, eType) && Reflect.apply(audio[eType], that, arg);
  }
  /*============= 通过页面代理触发的函数 this指向页面实例 =============*/
  static play() {
    //paused => true undefined 就是未播放 false 就是正在播放
    if(audio.paused === undefined) { 
      // 没有设置src的时候自然就是undefined
      AudioManager.setSong(this.data.playerSong, this.data.playerSongs);
    } else if (audio.paused === true) {
      audio.play()
    } else {
      audio.pause()
    }
  }
  // 歌曲切换上下一首
  static songTab(statu) {
    let index = this.data.playerSongs.findIndex(song => song.songmid === this.data.playerSong.songmid);
    // 上下一首的状态开关
    (statu) ? ++index : --index;
    (index < 0) && (index = this.data.playerSongs.length - 1);
    index %= this.data.playerSongs.length;
    
    let nextPlayersong = this.data.playerSongs[index]

    // 获取下一首播放链接
    new Promise(resovle => {
      wx.request({
        url: request.songurl + nextPlayersong.songmid,
        success: function (res) {
          nextPlayersong.songurl = res.data
          resovle(nextPlayersong)
        },
        fail: function (e) {
          console.log(song)
        }
      })
    }).then(song => {
      AudioManager.setSong(nextPlayersong, this.data.playerSongs);
    })

  }

  static prev() {
    AudioManager.songTab.call(this, false)
  }

  static next() {
    AudioManager.songTab.call(this, true);
  }

  static like() {
    if($like_db.has(this.data.playerSong.songmid)) {
        $like_db.del(this.data.playerSong)
    } else {
      $like_db.add(this.data.playerSong)
    }

    this.setData({
      like: $like_db.has(this.data.playerSong.songmid)
    })
  }

  static chat() {
    wx.navigateTo({
      url: '/pages/player/chat?' + utils.objDeUCode(this.data.playerSong),
    })
  }

  // static download() {
  //   const url = this.data.playerSong.songurl

  //   wx.showToast({
  //     icon: 'none',
  //     title: `正在下载 ${this.data.playerSong.song_name}`
  //   })

  //   const flie = wx.downloadFile({
  //     url,
  //     success(res) {
  //       console.log(res)
  //       wx.saveFile({
  //         tempFilePath: res.tempFilePath,
  //         success(res) {
  //           console.log('保存本地成功'),
  //           console.log(res)
  //         }
  //       })
  //     }
  //   })

  //   flie.onProgressUpdate((flie) => {
  //     console.log(`已下载 ${flie.progress}%`)
  //   })
  // }
  
  //构造方法
  constructor() { }
}