import PageModule from "../../lib/Page.js"
import Storage from "../../lib/Storage.js"
import utlis from "../../utils/utils.js"

const $app = getApp().appMouduleInstance
const $user_db = new Storage('user_db')

const $page = new PageModule({
  onLoad() {

  },

  getUserInfo(event) {
    let userInfo = event.detail.userInfo

    $app.data({ userInfo })

    if($user_db.where('time', '!=', '').find()) {
      $uesr_db.where('time', '!=', '').updata(userInfo)
    } else {
      $user_db.add(Object.assign({
        time: new Date().getTime()
      }, userInfo));
    }

    $user_db.save();
    
    //跳转到首页
    wx.redirectTo({
      url: '/pages/home/index',
    });
  }
})


$page.start()
