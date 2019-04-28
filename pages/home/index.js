import pageModule from '../../lib/Page.js'
import Banner from '../../model/Banner.js'
import { region, sheet, request } from '../../common/const.js'
import $pagemusic from "../../model/PageMusic.js";


const $namespace = 'home/index'

const $page = new pageModule({
  onLoad(o) {
    // 加载banner图信息
    const banner = new Banner(this)
    banner.getBanner().then(data => {
      this.setData({ banner: data })    
    })
    // 设置国家地区信息
    this.setData({ region })
    // 获取歌单信息
    this.getSheet()
      .findNameSpace($namespace)
      .then(this.setSheet.bind(this))

  },

  getSheet() {
    const sheetPromise = []

    sheet.forEach(item => {
      const p = new Promise((resolve) => {
        const url = request.topid + item.id
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

  setSheet(arg) {
    const sheetData = []
    // console.log(arg[0].data.songlist.slice(0, 6))
    arg.forEach((res, key) => {
      sheetData.push(Object.assign({
        songs: res.data.songs
      }, sheet[key]))
    })
    console.log(sheetData)
    this.setData({ sheets: sheetData })
  }
})

//继承公共的音乐模块
$page.extend($pagemusic);

//调用page
$page.start();