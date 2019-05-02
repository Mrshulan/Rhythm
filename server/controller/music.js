const axios = require('../services/axios')

// 小程序基础配置
const defaultConfig = {
  defaultApiCacheValidate: 1000 * 60 * 60 * 24,
  qqMusicCommonBaseUrl: 'https://c.y.qq.com',
  qqMusicUrlBaseUrl: 'https://u.y.qq.com',
  qqMusicHtmlUrl: 'https://i.y.qq.com/v8/playsong.html?songmid=004AeIvh4ML0Bz',
  albumImgUrl: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000 .jpg',
  singerAvatarUrl: 'https://y.gtimg.cn/music/photo_new/T001R150x150M000 .jpg',
  defaultData: {
    g_tk: '5381',
    uin: '0',
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: '0',
    platform: 'h5',
    needNewCode: '1',
    _: new Date().getTime()
  },
  defaultHeader: {
    authority: 'c.y.qq.com',
    path: 'musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=' + new Date().getTime(),
    scheme: 'https',
    accept: 'application/json',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'cache-control': 'no-cache',
    cookie: 'pgv_pvi=9065962496; pt2gguin=o1363693666; RK=nrwYgZLwf/; ptcz=fa62884057b1c65cf49abe3c3a59b4f496ab6b17da920c7d6d588e66bd50cdbc; pgv_pvid=8204344632; o_cookie=1363693666; tvfe_boss_uuid=4ba3dd3005b46f75; luin=o1363693666; lskey=00010000453ad87b261a19bddfcbbd9cc94d7809423cf25a85f37f25f04f7d78af40e82fc6de0f8f02fc4e42; pgv_info=ssid=s4431621626; yqq_stat=0; ts_uid=130901620; pgv_si=s8776760320; ts_refer=ADTAGmyqq',
    dnt: '1',
    origin: 'https://m.y.qq.com',
    pragma: 'no-cache',
    'Content-Type': 'application/json'
  }
}

exports.getLrc = async ctx => {
  const data = ctx.query
  const dataPramas  = ctx.params

  ctx.body = {
    data,
    dataPramas,
  }
}

exports.getSongUrl = async ctx => {
  const songId = ctx.params.id

  const options = {
    url: `${defaultConfig.qqMusicUrlBaseUrl}/cgi-bin/musicu.fcg`,
    headers: defaultConfig.defaultHeader,
    method: 'POST',
    data: {
      req_0: {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
          guid: '5579254314', songmid: [songId], songtype: [], uin: '', loginflag: 1, platform: '23', h5to: 'speed'
        }
      },
      comm: {
        g_tk: 1679324996, uin: '', format: 'json', ct: 23, cv: 0
      }
    }
  }

  const {req_0: { data: {midurlinfo:[{purl}],sip: [baseUrl] } } } = await axios(options)
  
  ctx.body = baseUrl + purl 
}