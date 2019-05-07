const Koa = require('koa')
const router = require('./routers/router')

const app = new Koa()

app.use(router.routes())
  .use(router.allowedMethods())

app.listen(6002, () => {
  console.log('音乐接口开放在6002端口')
})

