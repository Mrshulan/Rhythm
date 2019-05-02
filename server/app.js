const Koa = require('koa')
const router = require('./routers/router')

const app = new Koa()

app.use(router.routes())
  .use(router.allowedMethods())


app.listen(3000, () => {
  console.log('音乐接口开放在3000端口')
})

