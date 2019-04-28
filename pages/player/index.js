import pageModule from '../../lib/Page.js'
import $pagemusic from '../../model/PageMusic.js'

const $page = new pageModule({
  data: {
    psongstatu: false
  },

  showPsong() {
    this.setData({
      psongstatu: !this.data.psongstatu
    })
  }
})

$page.extend($pagemusic)
$page.start()
