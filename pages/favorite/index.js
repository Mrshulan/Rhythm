import PageModule from '../../lib/Page.js'
import $AudioPlayer from '../../model/AudioPlayer.js'
import FavoriteCache from '../../model/FavoriteCache.js'
import utils from '../../utils/utils.js'

const $favoriteCache_db = new FavoriteCache()

const default_album = "/images/default_album.jpg"

const $page = new PageModule({
  onLoad() {
    utils.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    })
  },
  onShow() {
    //数据列表
    const list = $favoriteCache_db.order("time", "desc").all()
    //封面
    const cover = list[0] ? list[0].album_big : default_album
    this.setData({ list, cover })
  },
  coverError() {
    this.setData({
      cover: default_album
    })
  }
})

$page.extend($AudioPlayer);

$page.start();
