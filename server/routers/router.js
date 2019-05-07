const Router = require('koa-router')
const Music = require('../controller/music')

const router = new Router()

router.prefix('/musicapi')

router.get('/', async ctx => {
  ctx.body = '音乐接口'
})

// 获取首页推荐
router.get('/getRecommend', Music.getRecommend)

// 获取搜索列表 /getSerach？w=songName&p=number(1)&r=number(18)
router.get('/getSearch', Music.getSearch)

// 获取排行榜列表数据 /getTopid?id=number&p=number(1)&r=number(6)
router.get('/getTopid', Music.getTopid)

// 获取真实song地址
router.get('/getSongUrl/:id', Music.getSongUrl)

// 获取歌词列表
router.get('/getLrc/:id', Music.getLrc)

module.exports = router