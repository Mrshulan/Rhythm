// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'music-comments-9369p'
})

// 拿到数据库控制权
const db = cloud.database()
const Comments = db.collection('Comments')

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event, context)

  const data = {
    songmid: event.songmid,//评论歌曲的id
    content: event.content,//评论内容
    userInfo: {
      openId: event.userInfo.openId,//用户关联开发者账号的openid
      avatarUrl: event.user.avatarUrl,// 用户头像封面
      gender: event.user.gender,//性别
      nickName: event.user.nickName//昵称
    },
    time: new Date().getTime()//评论的时间
  };


  //数据库的操作可能会引发错误,需要  try catch打印异常
  try {

    //return await song_chat;
    return await Comments.add({
      // data 字段表示需新增的 JSON 数据
      data: data
    });
  } catch (e) {
    console.error(e)
  }
}