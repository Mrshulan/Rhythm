export default class Banner {
  constructor(page) {
    Reflect.set(page, 'actionBanner', Banner.actionBanner)
  }

  static actionBanner(event) {
    console.log(event)
  }

  getBanner() {
    const data = []

    // banner图的类型有多种,有的是跳转专题,有的单曲推荐
    data.push({
      img: "http://p1.music.126.net/ulW4yJjxB8eAvInYOobNLg==/109951163621926009.jpg",
      atype: 0//专题
    });

    //单曲推荐
    data.push({
      img: "http://p1.music.126.net/eutlOcSlh-dtpWq328R6bQ==/109951163615791721.jpg",
      atype: 1//单曲推荐
    });

    //单曲推荐
    data.push({
      img: "http://p1.music.126.net/fklp8j8RXOys1RyEbC00iA==/109951163621954602.jpg",
      atype: 3//单曲推荐
    });

    // 真正banner图信息是从后台获取的,所以这里有回调,使用promise返回
    return new Promise((resolve) => {
      resolve(data)
    })
  }
}