# wx-sdk-api

## 文件

- wx-api.js 封装类
- SHA1.js sha1签名方法

## 使用

1. 配置请求授权接口地址

配置VUE_APP_ADMIN环境变量为后端接口地址

- 注：wx-api.js中已包含生成签名步骤，如果签名由后端生成需要删改69-83行代码

2. 引入并使用

```js
// 变量自定义，以"weixin"为例
import weixin from "./wx-api.js";

// 权限验证初始化 链式书写
weixin
  .onInit(
    () => console.log("验证通过"),
    err => console.log("验证失败", err)
  )
  // 配置微信/QQ好友分享
  .configFriendShare({
    title: "自定义的标题",
    desc: "自定义的微信副标题",
    imgUrl: require("@/assets/img/share.png"),
    link: process.env.VUE_APP_RESOURCE_URL + "index.html"
  });

  // 监听分享微信好友成功 非链式书写
  weixin.onShareWXFriend(() => console.log("成功监听并执行了分享微信好友回调"));
```

## 方法（更新中）

- weixin.onInit(success,fail)
  - 监听权限验证回调

- weixin.hideMenuItems(menuList)
  - 隐藏菜单项

- weixin.configFriendShare(config)
  - 配置微信/QQ好友分享

- weixin.configTimeLineShare(config)
  - 配置分享到朋友圈/QQ空间

- weixin.onShareWXFriend(success)
  - 监听分享微信好友回调

- weixin.onShareQQFriend(success)
  - 监听分享QQ好友回调

- weixin.onShareTimeLine(success)
  - 监听分享朋友圈回调


- 注：目前微信js-sdk最新接口已经不支持监听用户分享回调，仅旧的分享接口支持；因此旧接口废弃后，类方法上监听分享相关方法将不执行任何处理；