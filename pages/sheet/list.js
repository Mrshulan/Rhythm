import PageModule from "../../lib/Page.js";
import { request } from "../../common/const.js";
import $SongList from "../../model/SongList.js";
import $AudioPlayer from "../../model/AudioPlayer.js";


const $page = new PageModule($SongList)

// $SongList里边有load了
$page.addEvent('onLoad', function (sheet) {
  this.data.url = request.topid +"?id=" + sheet.id

  wx.setNavigationBarTitle({
    title: sheet.name,
  })

  this.loadData()
})

$page.extend($AudioPlayer);


$page.start();