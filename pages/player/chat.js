import PageModule from '../../lib/Page.js'
import utils from '../../utils/utils.js'

// 获取云端评论控制权(文档集合型)
const db = wx.cloud.database()
const Comments = db.collection('Comments')

const $page = new PageModule({
  data: {
    content: '',
    currentAddCount: 0,
    commentList: [],
    page: 1,
    row: 20
  },

  onLoad(song) {
    // 设置标题
    wx.setNavigationBarTitle({
      title: `${song.song_name}`
    })
    // url带过来的data en de反转拿到到的song数据更新到page里边
    this.setData({ song })
    // 获取用户信息
    utils.getUserInfo().then(userData => {
      this.data.user = userData
    })
    // 获取歌曲评论
    this.getComments()
  },
  // 滚动加载更多
  moreComments() {
    this.data.page++
    this.getComments()
  },
  // 设置数据
  setComments(data) {
    wx.hideNavigationBarLoading()
    // then返回的数据
    const datas = data.data
    // 时间遍历设置 中文...
    datas.forEach(item => {
      item['time'] = (date => {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      })(new Date(item['time']))
    })

    // 列表数据更新
    const commentList = this.data.commentList

    commentList.push(...data.data)

    this.setData({ commentList })
  },

  // 获取歌曲评论列表
  getComments() {
    //显示顶部导航的加载图标
    wx.showNavigationBarLoading();

    // 注意setComments的this指向
    return Comments.where({
      'song_mid': this.data.song.song_mid
    })
    .skip(this.data.page * this.data.row - this.data.row + this.data.currentAddCount)
    .limit(this.data.row)
    .orderBy("time", "desc")
    .get()
    .then(this.setComments.bind(this))

  },
  // 添加评论事件
  addComment(event) {
    // bindsubmit过来的数据
    const content = event.detail.value.content

    if(!content.trim()) {
      wx.showToast({
        icon: 'none',
        title: '评论内容不能为空'
      })
    }
    // 整合需要发送云端的数据
    const data = { 
      content,
      song_mid: this.data.song.song_mid,
      user: this.data.user
    }

    // console.log(data)
    wx.cloud.callFunction({
      name: 'addComment',
      data: data,
      success: res => {
        if(res.result) {
          // 若是成功立即生成一个伪评论 伪装commentList项
          data.userInfo = data.user

          data.time = (date => {
            return `${date.getMonth() + 1}月${date.getDate()}日`;
          })(new Date())

          this.data.commentList.unshift(data)
          this.setData({
            content: '',
            commentList: this.data.commentList
          })
          // 伪评论计数加一 防止分页错乱
          this.data.currentAddCount++

          wx.showToast({
            icon: 'none',
            title: '评论成功'
          })
        }
      },
      fail(error) {
        wx.showToast({
          title: '服务器发送错误~'
        })
      }
    })
  }
})

$page.start()