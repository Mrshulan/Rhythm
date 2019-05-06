import PageModule from '../lib/Page.js'
import { request } from '../common/const.js'

const $page = new PageModule({
  // 加载事件
  onLoad() {
    Object.assign(this.data, {
      url: '',
      page: 1,
      row: 18,
      songs: [],
      stock: true // 有库存待加载
    })
  },
  // 加载数据
  loadData() {
    if(this.data.stock === false) {
      return wx.showToast({
        icon: 'none',
        title: '没有更多了'
      })
    }

    const url = this.data.url + '&p=' + this.data.page + "&r=" + this.data.row;
    // 显示加载图标
    wx.showLoading()
    // 发送请求开始加载数据
    const res_data = new Promise((resolve, reject) => {
      wx.request({
        url: url,
        success: resolve
      })
    })

    // then去打包数据
    res_data.then(this.codePage.bind(this))
  },
  // 处理数据
  codePage(res) {
    const data = res.data
    // 隐藏加载图标
    wx.hideLoading()

    // 更新歌单 判断是否加载完毕(在loadData判断弹出)
    this.data.songs.push(...data.songList)
    this.data.stock = this.data.page < data.count_page
    // 更新数据
    this.setData({
      songs: this.data.songs
    })
  },

  // 加载更多
  morePage() {
    this.data.page++
    this.loadData()
  },
  // 加载图片出错
  imgLoadError(event) {
    let imgUrl = "/images/default_album.jpg"
    let song = event.target.dataset.song

    let index = this.data.songs.findIndex(item => item.songmid === song.songmid);
    
    if (index > -1) {
      this.data.songs[index].album_min = imgUrl
      this.data.songs[index].album_big = imgUrl;
      this.setData({ songs: this.data.songs });
    } 
  }
})

export default $page