import PageModule from '../../lib/Page.js'
import $pagemusic from '../../model/PageMusic.js'
import LikeSong from '../../model/LikeSong.js'
import utils from '../../utils/utils.js'

const $like_db = new LikeSong()

const default_ablum = "/images/default_album.jpg"

const $page = new PageModule({
  onLoad() {
    utils.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    })

    const list = $like_db.order('time', 'desc').all()
    console.log(list)
    const cover = list[0] ? list[0].album_big : default_ablum;

    this.setData({ list, cover })
  },

  coverError() {
    this.setData({
      cover: default_ablum
    })
  }
})



$page.extend($pagemusic);

$page.start();
