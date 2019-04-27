import PageModule from "../../lib/Page.js";
import { request } from "../../common/const.js";
import $pageList from "../../model/PageList.js";

const $page = new PageModule($pageList)

$page.addEvent('onLoad', function (sheet) {
  this.data.url = request.topid + sheet.id

  wx.setNavigationBarTitle({
    title: sheet.name,
  })

  this.loadPage()
})

$page.start();