import PageModule from "../../lib/Page.js";
import { request } from "../../common/const.js";
import $pageList from "../../model/PageList.js";
import $pagemusic from "../../model/PageMusic.js";
import SearchSong from "../../model/SearchSong.js";


const $search_song = new SearchSong()
const $page = new PageModule($pageList)

$page.extend($pagemusic);


$page.start({
  onLoad(query) {
    const songName = query.q

    this.data.url = request.query + songName;

    wx.setNavigationBarTitle({
      title: songName
    })

    this.setData({ q: songName })

    this.loadPage()
  },

  query(event) {
    const data = event.detail.value

    $search_song.add(data.q)

    this.onLoad(data)
  }
})