import AppModule from '../lib/App.js'
import Storage from '../lib/Storage.js'

// 音频本地缓存
const $audio_db = new Storage('audio_db')
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
      src: 'http://dl.stream.qqmusic.qq.com/C400002NMnL20hPR6W.m4a?guid=8253071150&vkey=1C9E3BEE224AA98A0D8B8228A64766608392676C1EFC484EB7864572A1823DBFED938C562DFF53E36677A1ED037D9E98B1BA3A7DC5776E5C&uin=7179&fromtag=66',
      title: song.song_name,
      epname: song.album_name,
      singer: song.song_orig,
      coverImgUrl: song.album_min
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
    let index = this.data.playerSongs.findIndex(song => song.song_mid === this.data.playerSong.song_mid);
    // 上下一首的状态开关
    (statu) ? ++index : --index;
    (index < 0) && (index = this.data.playerSongs.length - 1);
    index %= this.data.playerSongs.length;
    
    //设置导航标题
    wx.setNavigationBarTitle({
      title: this.data.playerSongs[index].song_name,
    })

    AudioManager.setSong(this.data.playerSongs[index], this.data.playerSongs);
  }

  static prev() {
    AudioManager.songTab.call(this, false)
  }

  static next() {
    AudioManager.songTab.call(this, true);
  }
  //构造方法
  constructor() { }
}