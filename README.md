# Rhythm(音乐站小程序)

## 前言

该项目针对小程序这一块学习的成果，在此之前都听说小程序的写法像极了Vue，比方说wx:for这些的...(我是一个深深的React党，这种语法开始实在是不习惯,还是觉得jsx语法糖好...到现在还是这认为的)，项目对qq音乐接口二次开发，利用小程序的本地缓存作为数据来源，该项目更多是运用之前跟着前辈写[ jQuery 和 Underscore微型库](https://github.com/Mrshulan/Go-ahead_FE/tree/master/util)学来的原生经验的一种实践，可以从我对问题的解决都是往**原生**角度去思考，来做的个人音乐站小程序。

接下来要巴拉一堆我认为可以加深小程序的理解的 cv话(真的很有用). 还是不太明白的话可以看小程序官方文档，闭圈比较...唉。

其实本质小程序就是（混合）的app 介于web app与native 原生app之间，具备丰富的调用手机各种功能的接口，同时又具备灵活性，跨平台。

### 小程序快的原因

- 安装包缓存
- 分包加载
- 独立渲染线程
- Webview预加载
- Nativce组件

### 小程序架构

微信小程序的框架包含两部分View视图层(可能存在多个)、App Service逻辑层(一个)，View层用来渲染页面结构，AppService层用来逻辑处理、数据请求、接口调用，它们在两个线程里运行。

视图层使用WebView渲染，逻辑层使用JSCore运行。

视图层和逻辑层(不同的线程)通过系统层的WeixinJsBridage进行通信，逻辑层把数据变化通知到视图层，触发视图层页面更新，视图层把触发的事件通知到逻辑层进行业务处理，如果需要视图层自己做一些简单的计算可以使用wxs `<wxs src="../../common/function.wxs" module="common"> </wxs>`

![小程序架构](<https://user-gold-cdn.xitu.io/2018/5/17/1636cb90ba54f91e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1>)

### 小程序运行

- 小程序没有重启的概念 进入后台时间过长或者短时间内存连续警告，小程序主动销毁

- 冷启动 用户首次打开或小程序被微信主动销毁后再次打开的情况，此时小程序需要重新加载启动(异步下载新版本的代码包,再次打开即可加载新的或者使用wx.getUpdateManager立刻处理)
- 热启动 用户已经打开过某小程序，之后一定时间内再次打开该小程序，无需重新启动，只需将后台态的小程序切换到前台

### 页面视图

视图层由 WXML 与 WXSS 编写，由组件来进行展示。

将逻辑层的数据反应成视图，同时将视图层的事件发送给逻辑层。

- View - WXML wxml编译器：wcc 把wxml文件 转为 js 执行方式：wcc index.wxml
- View - WXSS wxss编译器：wcsc 把wxss文件转化为 js 执行方式： wcsc index.wxss
- View - Component  基于Web Component标准 template
- View - Native Component  `< camera/> <input />(focus) <canvas/> <video/> <map/> <textarea/>` Native组件层在WebView层之上 层级最高

### WebView预加载

每次小程序进入除了当前页面,Native预先额外加载一个WebView， 当打开指定页面时，用默认数据直接渲染，请求数据回来时局部更新

###  App Service(逻辑层)

逻辑层将数据进行处理后发送给视图层，同时接受视图层的事件反馈

- App( ) 小程序的入口；Page( ) 页面的入口
- 提供丰富的 API，如微信用户数据，扫一扫，支付等微信特有能力。
- 每个页面有独立的作用域，并提供模块化能力。
- 数据绑定、事件分发、生命周期管理、路由管理

#### 视图层操作binding

- 数据绑定使用 Mustache 语法（双大括号）将变量包起来，动态数据均来自对应 Page 的 data，可以通过setData方法修改数据。

- 事件绑定的写法同组件的属性，以 key、value 的形式，key 以bind或catch开头，然后跟上事件的类型，如bindtap, catchtouchstart，value 是一个字符串，需要在对应的 Page 中定义同名的函数。

#### 生命周期

![appServiceLife](<https://user-gold-cdn.xitu.io/2018/5/17/1636cd7c3361d03e?imageslim>)

onReady是在onShow之后触发；

onReady和onLoad一样只在页面入栈时渲染一次；

### API

API通过WeixinJSBridge和Native 进行通信, 包括 网络 媒体 数据 位置定位 设备 界面 开发用户接口的等。

#### 路由管理

- navigateTo(OBJECT)

保留当前页面onHide，跳转到应用内的某个页面，使用navigateBack可以返回到原页面onShow。页面路径只能是五层

- redirectTo(OBJECT)

关闭当前页面onUnload，跳转到应用内的某个页面。

- navigateBack(OBJECT)

关闭当前页面onUnload，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。

#### 跨平台运行环境

IOS - JSCore

Android - X5 JS解析器

DevTool - nwjs Chrome 内核

#### 存在的一些问题

小程序仍然使用WebView渲染，并非原生渲染

需要独立开发，不能在非微信环境运行 。

开发者不可以扩展新组件。

依赖浏览器环境的js库不能使用，因为是JSCore执行的，没有window、document对象。

WXSS中无法使用本地（图片、字体(转base64可以支持目前)等）。

WXSS转化成js 而不是css。

小程序无法打开页面，无法拉起APP。

#### 一些优点

- 提前新建WebView，准备新页面渲染。

- View层和逻辑层分离，通过数据驱动，不直接操作DOM。

- 使用Virtual DOM，进行局部更新。

- 全部使用https，确保传输中安全。

- 加入rpx(responsive pixel)单位 规定屏幕宽为750rpx，隔离设备尺寸，方便开发。

### 优化建议 

- setData  由于视图层和逻辑层处于两个线程，之间数据传输，实际上通过两边提供的 `evaluateJavascript & publishData` 所实现。即用户传输的数据，需要将其转换为字符串形式传递，同时把转换后的数据内容拼接成一份 JS 脚本，再通过执行 JS 脚本的形式传递到两边独立环境，数据到达视图层并不是实时的。
  - 避免频繁的去 setData WebView 的 JS 线程忙碌怠慢了 和 逻辑层的响应 (适当合并一些data. 比方说这个项目里边的home page 里边的 banner region)
  - 避免一次传大量数据 `evaluateJavascript` 卡住
  - 不要后台态页面进行 setData，无意义
- 图片资源 大图片和长列表图片图片体积的处理和回收内存
- 代码包大小 分包加载 类似于chunk块来理解 首屏
- 预先加载数据 小程序在启动时，会直接加载所有页面逻辑代码进内存 即便有些page并没有使用到，page用到的数据也不会消失，通常情况下，我们习惯将数据拉取写在 onLoad 事件中。而**redirecting后onLoad有300ms ~ 400ms 的延时的**。完全可以在redirecting中提前获取数据，之后redirecting的页面提前获取数据。比方说我在该项目提前`wx.getUserInfo`进行存储。

参考内容: [微信小程序运行流程看这篇就够了](https://juejin.im/post/5afd136551882542682e6ad7#heading-3)

## 实现功能

- [x] 歌曲歌单获取
- [x] 歌曲切换
- [x] 歌曲喜欢
- [x] 歌曲搜索
- [x] 歌曲下载 (console台)
- [x] 歌曲评论云同步
- [x] 播放器滑块歌词
- [ ] ...

## 效果展示(有点粗糙)

整体浏览

![整体浏览](http://qiniu.mrshulan.com/%E9%9F%B3%E4%B9%90%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%A2%84%E8%A7%88.gif)



## 项目目录

```
- common 放些常量和 视图层wxs工具函数
- lib 底层的一些class封装
- model 使用lib层二次开发一些定向需求
- pages 页面配置
- server QQ音乐接口获取(可以拿去继续开发ahh)
- template 组件模板
- utils js工具函数
```

lib层底层封装: 

 - array原型增加一个命名空间 
 - 实现一个Event发布订阅模式，封装App，Page公有模版继承
 - 模仿增删改成利用本地缓存封装一个Storage
 - AudioManger  API audio独立的管理方法操作

model层: 针对性的实现一些功能,比方说 一些指定的本地缓存 以及 底部播放器的控制

## 遇到的问题

- onLoad传递数据 包括url真实的路径http传不过去 在事件队列触发器里边拦截onLoad decodeURIComponent做出处理
- page事件绑定单一 全局操作需要当前page数据 事件不能很好的扩展 比方说 Audio出现在多个page怎么一块处理这个onShow 可以通过事件队列 和 extend封装来继承方法/属性
- navigateBack后播放失效, onShow 执行 和 onLoad 加载一次性 区别
- 数据如何CRUD， 封装Storage => where(...args) [可以传key, value也可以传入对象进行多条件
- 歌曲切换轮播 联想 轮播图的解决方法
- 歌词的打包 HtmlEncode编码解码有点儿烦躁 全程通过 正则 split replace(特殊情况有点多，有些是开头没用的,非歌词，通过解码分析格式)  适配自己需要的 [ {} ] 模样  audio.currentTime 和 我们的millisecond比较决定显示到哪一行歌词了
- 音乐的真实路径获取(之前是可以直接获取的)   通过 axios 带上refer cookie guid 这些必要数据 来请求真实路径 之后 对response的数据进行解构取值 适配 返回给小程序



## 想说的是

此前学习的都是一些基本功，当真正自己干一个项目的时候，可能就会有一种感觉，感觉啥也不会(因为之前感觉自己啥也学习了，于是就干上了) 😰，好不容易弄出来了，给同学一测试emm gg,又有新的问题了，上线又是一堆bug等着你解决，记住解决bug会越解越多(这个时候就不能放弃了)，但是最后锻炼的还是解决问题能力，以后有相同类型的需求的话，就可以考虑很多因素了，比方说问自己 为什么要这么做，还可以怎么做，区别怎么对比，怎么取舍。

零碎的知识点联合在一起真的是一件很痛苦的事情唉，然后发觉前端路漫漫，学习的东西真的真的好多，但是话又说回来，既然喜欢上了前端，就得付出时间和代价hmm。

> 总结我这一年学习的最大感触就是: 知识一定要形成体系
>
> 附上我的代码仓库[**Go-ahead_FE**](https://github.com/Mrshulan/Go-ahead_FE) 里边啥都有真的~

如果喜欢 欢迎(孬也)给个star star star 不是 skr skr skr！！！ 来自一个学弟(准备秋招)的乞讨脸.jpg 😂