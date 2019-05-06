import PageModule from "../../lib/Page.js"
import $SongList from "../../model/SongList.js"
import $AudioPlayer from "../../model/AudioPlayer.js"
import SearchCache from "../../model/SearchCache.js"
import { request } from "../../common/const.js"

const $searchCache_db = new SearchCache()
// pageModule实例
const $page = new PageModule($SongList)
$page.extend($AudioPlayer)

$page.start({
  onLoad(query) {
    const keyword = query.w
    this.data.url = request.search + '?w=' + keyword;

    wx.setNavigationBarTitle({
      title: keyword
    })

    this.setData({ w: keyword })

    this.loadData()
  },

  query(event) {
    const { keyword } = event.detail.value
    $searchCache_db.add(keyword)
    // 重新加载
    this.onLoad({w: keyword})
  }
})