import PageModule from "../../lib/Page.js";
import SearchCache from "../../model/SearchCache.js"
import $AudioPlayer from "../../model/AudioPlayer.js"

const $searchCache_db = new SearchCache()

const $page = new PageModule({
  data: {
    w: '',
    history: []
  },
  // 每次显示都需要更新
  onShow() {
    this.updata()
  },

  query(event) {
    const keyword = event.detail.value.keyword.trim()
    if (!keyword) {
      return wx.showToast({
        icon: "none",
        title: "啥也没有输入！"
      });
    }

    $searchCache_db.add(keyword)

    this.updata()

    wx.navigateTo({
      url: 'list?w=' + keyword,
    })
  },

  del(event) {
    const keyword = event.currentTarget.dataset.keyword
    
    $searchCache_db.del(keyword)
    this.updata()
  },

  updata() {
    const data = $searchCache_db.all()
    this.setData({ 
      w: data,
      keyword: ''
    })
  }
})

$page.extend($AudioPlayer);

$page.start();