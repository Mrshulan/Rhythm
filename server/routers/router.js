const Router = require('koa-router')
const Music = require('../controller/music')

const router = new Router()

router.get('/', async ctx => {
  ctx.body = '音乐接口'
})

router.get('/getLrc/:id', Music.getLrc)

router.get('/getTopid', Music.getTopid)

// 获取真实song地址
router.get('/getSongUrl/:id', Music.getSongUrl)

module.exports = router