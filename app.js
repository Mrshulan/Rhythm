import AppModule from "./lib/App.js"
import { envStr, envObj } from "./common/const.js"

// 初始化云开发功能
wx.cloud.init({ env: envStr })

const $app = new AppModule()

// 此时里边App方法就管用了
$app.start()
