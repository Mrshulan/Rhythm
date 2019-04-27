import PageModule from "../../lib/Page.js";
import SearchSong from "../../model/SearchSong.js";

const $search_song = new SearchSong()

const $page = new PageModule({
  data: {
    q: '',
    history: []
  },

  onShow() {
    this.updata()
  },

  query(event) {
    const q = event.detail.value.q.trim()

    if(!q) {
      return wx.showToast({
        icon: "none",
        title: "走点心,不要全都输入空格"
      });
    }

    //保存数据到本地数据库
    $search_song.add(q);

    this.updata()

    wx.navigateTo({
      url: 'list?q=' + q,
    })
  },

  del(event) {
    const songName = event.currentTarget.dataset.song
    
    $search_song.del(songName);
    this.updata()
  },

  updata() {
    const data = $search_song.all()
    this.setData({ 
      history: data,
      q: ''
    })
  }
})

$page.start();