// 猜你喜欢
export const region = [
  { name: "内地", id: 5, logo: '/images/icon/ZG.png' },
  { name: "港台", id: 6, logo: '/images/icon/TW.png' },
  { name: "欧美", id: 3, logo: '/images/icon/OM.png' },
  { name: "韩国", id: 16, logo: '/images/icon/HG.png' },
  { name: "日本", id: 17, logo: '/images/icon/RB.png' }
];

// 主页推荐歌单
export const sheet = [
  { name: "热门歌曲", id: 26 },
  { name: "新歌专辑", id: 27 },
  { name: "网络歌曲", id: 28 }
];

//请求接口
export const request = {
  host: "http://mrshulan.xin/musicapi/"
}
request.songurl = request.host + 'getSongUrl/' // 歌曲真实地址
request.recommend = request.host + 'getRecommend' // 首页推荐
request.topid = request.host + "getTopid" // 歌单
request.search = request.host + "getSearch" // 搜索
request.lyrics = request.host + "getLrc/" // 歌词


// 云开发配置
export const envStr = "music-comments-9369p";
export const envObj = {
  database: envStr,
  storage: envStr,
  functions: envStr
};