
//国家地区
export const region = [
  { name: "欧美", id: 3 },
  { name: "内地", id: 5 },
  { name: "港台", id: 6 },
  { name: "韩国", id: 16 },
  { name: "日本", id: 17 }
];

//推荐歌单
export const sheet = [
  { name: "热门歌曲", id: 26 },
  { name: "新歌专辑", id: 27 },
  { name: "网络歌曲", id: 28 }
];


//请求url
export const request = {
  //服务器主机
  host: "http://127.0.0.1/"
};
request.topid = request.host + "topid/";//歌单
request.query = request.host + "query/";//搜索
request.lyrics = request.host + "lyrics/";//歌词

//云开发
export const envStr = "music-comments-9369p";
export const envObj = {
  database: envStr,
  storage: envStr,
  functions: envStr
};