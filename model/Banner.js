import AudioManager from '../lib/AudioManager.js'

export default class Banner {

  constructor(page) {
    // 监听广告图的动作信息
    Reflect.set(page, 'actionBanner', Banner.actionBanner)
  }


  static actionBanner(event) {
    const action = event.currentTarget.dataset.action

    // 专题跳转
    if(action.type === 0) {
      wx.navigateTo({
        url: '/pages/sheet/list?id=' + action.data.id + "&name=" + action.data.name,
      })
    // 专辑推荐
    } else if(action.type === 1) {
      AudioManager.setSong(action.data, [])
      wx.navigateTo({
        url: `/pages/player/index?name=${action.data.song_name}&mid=${action.data.song_mid}}`
      })
    }
  }

  getBanner() {
    const data = []

    // banner图的类型有多种,有的是跳转专题,有的单曲推荐
    data.push({
      img: "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/595982.jpg?max_age=2592000",
      type: 0,//专题
      data: {
        id: 108,
        name: "美国公告牌榜"
      }
    })

    //单曲推荐
    data.push({
      img: "http://p1.music.126.net/fklp8j8RXOys1RyEbC00iA==/109951163621954602.jpg",
      type: 1,//单曲推荐
      data: {
        song_url: "http://dl.stream.qqmusic.qq.com/C400001luHbo2nQT1Y.m4a?guid=8253071150&vkey=7D20F133C97865E53BF15052D048DC7F32A61FCD78EE31939238FB829EAD48D772449DF9A928C41B482EF54E203EA90AC6752E4E266C2EFD&uin=7179&fromtag=66",
        song_mid: "001dPKD40OUxFz",
        song_name: "耳朵",
        song_orig: "李荣浩",
        album_min: "https://y.gtimg.cn/music/photo_new/T002R90x90M000004QnEHc3zjC7J.jpg",
        album_big: "https://y.gtimg.cn/music/photo_new/T002R300x300M000004QnEHc3zjC7J.jpg",
        album_mid: "004QnEHc3zjC7J",
        album_name: "耳朵"
      }
    });

    // 真正banner图信息是从后台获取的,所以这里有回调,使用promise返回
    return new Promise((resolve) => {
      resolve(data)
    })
  }
}