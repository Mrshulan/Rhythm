import pageModule from '../../lib/Page.js'
import Banner from '../../model/Banner.js'
import { region, sheet, request } from '../../common/const.js'
import $pagemusic from "../../model/PageMusic.js";

// 页面的命名空间
const $namespace = 'home/index'

// 实例page模型
const $page = new pageModule({
  onLoad(o) {
    // 加载banner图信息
    const banner = new Banner(this)
    banner.getBanner().then(res => {
      console.log(res.data)
      this.setData({ banner: res.data.slider })    
    })
    // 设置国家地区信息
    this.setData({ region })
    // 获取歌单信息
    this.getSheet()
      .findNameSpace($namespace)
      .then(this.setSheet.bind(this))

  },
  // 获取歌单信息
  getSheet() {
    const sheetPromise = []
    // 循环歌单请求
    sheet.forEach(item => {
      const p = new Promise((resolve) => {
        const url = request.topid + "?id=" + item.id
        wx.request({
          url: url,
          success: resolve
        })
      })

      sheetPromise.push(p)
    })

    return {
      nameSpace: $namespace,
      data: Promise.all(sheetPromise)
    }
  },
  // 设置歌单信息
  setSheet(arg) {
    console.log(arg)
    const sheetData = []

    arg.forEach((res, key) => {
      sheetData.push(Object.assign({
        songs: res.data.songList
      }, sheet[key]))
    })

    this.setData({ sheets: sheetData })
  }
})

//继承公共的音乐模块
$page.extend($pagemusic);

//调用page
$page.start();