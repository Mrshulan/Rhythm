import PageModule from '../lib/Page.js'
import { request } from '../common/const.js'

const $page = new PageModule({
  onLoad() {
      Object.assign(this.data, {
      url: '',
      page: 1,
      row: 20,
      songs: [],
      stock: false
    })
  },

  loadPage() {
    if(this.data.stock) {
      return wx.showToast({
        icon: 'none',
        title: '没有更多了'
      })
    }

    const url = this.data.url + '/p/' + this.data.page + "/r/" + this.data.row;

    wx.showLoading()

    const res_data = new Promise((resolve, reject) => {
      wx.request({
        url: url,
        success: resolve
      })
    })

    res_data.then(this.codePage.bind(this))
  },

  codePage(res) {
    const data = res.data

    wx.hideLoading()

    this.data.songs.push(...data.songs)
    this.data.stock = this.data.page >= data.count_page

    this.setData({
      songs: this.data.songs
    })
  },

  morePage() {
    this.data.page++

    this.loadPage()
  }
})

export default $page