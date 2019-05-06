import pageModule from '../../lib/Page.js'
import Banner from '../../model/Banner.js'
import $AudioPlayer from "../../model/AudioPlayer.js"
import { region, sheet, request } from '../../common/const.js'

// 页面的命名空间
const $namespace = 'home/index'

// 实例page模型
const $page = new pageModule({
  onLoad() {
    // 头部
    const banner = new Banner(this)
    banner.getBanner().then(res => {
      this.setData({ 
        banner: res.data.slider,
        region // 设置全球好听列表
      })    
    })

    // 获取歌单信息 实例上的getSheet()已经变成了事件触发器了 (这里的{}只是用来extend的)
    this.getSheet()
      .findNameSpace($namespace) // 首页专属data 不然和default混合了
      .then(this.setSheet.bind(this))
  },
  // 获取歌单信息
  getSheet() {
    const sheetPromises = []
    // 循环歌单请求包装
    sheet.forEach(item => {
      const p = new Promise((resolve) => {
        const url = request.topid + "?id=" + item.id
        wx.request({
          url: url,
          success: resolve
        })
      })
      sheetPromises.push(p)
    })

    return {
      nameSpace: $namespace,
      data: Promise.all(sheetPromises)
    }
  },
  // 设置歌单信息
  setSheet(arg) {
    // then过来的 首页需要的歌单信息数组 
    const sheetData = []
    arg.forEach((res, key) => {
      sheetData.push(Object.assign({
        songs: res.data.songList
      }, sheet[key]))
    })
    this.setData({ sheets: sheetData })
  }
})

// 继承AudioPlayer的事件和属性
$page.extend($AudioPlayer);

//调用page
$page.start();