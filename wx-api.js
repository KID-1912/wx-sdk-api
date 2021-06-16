import axios from "axios";
import wx from "weixin-js-sdk";
import { hex_sha1 } from "@common/js/SHA1.js";

class Weixin {
  // 构造函数
  constructor() {
    // 原型方法为Processor添加任务流程即可
    this.Processor = Weixin.initAuth();
  }

  // 类的静态属性/方法

  // 授权地址
  static authUrl = process.env.VUE_APP_ADMIN;

  // 授权API列表
  static authAPIList = [
    "checkJsApi",
    "onMenuShareTimeline",
    "onMenuShareAppMessage",
    "onMenuShareQQ",
    "onMenuShareWeibo",
    "hideMenuItems",
    "showMenuItems",
    "chooseImage",
    "previewImage",
    "uploadImage",
    "scanQRCode",
    "closeWindow",
    "updateAppMessageShareData",
    "updateTimelineShareData"
  ];

  // 检测API列表
  static checkAPIList = [
    "onMenuShareAppMessage",
    "onMenuShareTimeline",
    "onMenuShareQQ",
    "onMenuShareWeibo"
  ];

  // 通过检测的API
  static checkedAPIs = null;
  // static checkedAPIs = {
  //   onMenuShareAppMessage: true,
  //   onMenuShareTimeline: true,
  //   onMenuShareQQ: true,
  //   onMenuShareWeibo: true
  // };

  // 微信/QQ好友分享配置
  static shareFriendConfig = {};

  // 微信朋友圈/QQ空间分享配置
  static shareTimeLineConfig = {};

  // 初始化授权
  static async initAuth() {
    const res = await axios.get(this.authUrl);
    const data = res.data;

    // 授权失败
    if (!data) {
      return Promise.reject();
    }

    // 开始配置
    let appId = data.model.appId;
    let jsApiTicket = data.model.jsapi_ticket;
    let timestamp = new Date().getTime() + "";
    let nonceStr = timestamp + parseInt(Math.random() * 100000) + "";
    //SHA1加密
    let strSHA1 = hex_sha1(
      "jsapi_ticket=" +
        jsApiTicket +
        "&noncestr=" +
        nonceStr +
        "&timestamp=" +
        timestamp +
        "&url=" +
        window.location.href.split("#")[0]
    );
    wx.config({
      debug: false,
      appId: appId,
      timestamp: timestamp,
      nonceStr: nonceStr,
      signature: strSHA1,
      jsApiList: this.authAPIList
    });
    return new Promise((resolve, reject) => {
      wx.ready(() => {
        wx.checkJsApi({
          jsApiList: Weixin.checkAPIList,
          success: res => {
            Weixin.checkedAPIs = res.checkResult;
            resolve();
          }
        });
      });
      wx.error(() => reject());
    });
  }

  // 实例方法

  // 监听授权成功/失败
  onInit(success, fail) {
    this.Processor.then(success).catch(fail);
    return this;
  }

  // 监听分享微信好友回调
  onShareWXFriend(success) {
    this.Processor.then(() => {
      if (Weixin.checkedAPIs["onMenuShareAppMessage"]) {
        wx.onMenuShareAppMessage({ ...Weixin.shareFriendConfig, success });
      }
    });
    return this;
  }

  // 监听分享QQ好友回调
  onShareQQFriend(success, cancel) {
    this.Processor.then(() => {
      if (Weixin.checkedAPIs["onMenuShareQQ"]) {
        wx.onMenuShareQQ({
          ...Weixin.shareFriendConfig,
          success,
          cancel
        });
      }
    });
    return this;
  }

  // 监听分享朋友圈回调
  onShareTimeLine(success) {
    this.Processor.then(() => {
      if (Weixin.checkedAPIs["onMenuShareTimeline"]) {
        wx.onMenuShareTimeline({ ...Weixin.shareTimeLineConfig, success });
      }
    });
    return this;
  }

  // 隐藏菜单项
  hideMenuItems(menuList) {
    this.Processor.then(() => {
      wx.hideMenuItems({ menuList });
    });
    return this;
  }

  // config配置参数
  // {
  //   title: '', // 分享标题
  //   desc: '', // 分享描述
  //   link: '', // 分享链接
  //   imgUrl: '', // 分享图标
  // }

  // 配置微信/QQ好友分享
  configFriendShare(config) {
    Weixin.shareFriendConfig = config;
    this.Processor.then(() => {
      if (Weixin.checkedAPIs["onMenuShareAppMessage"]) {
        wx.onMenuShareAppMessage(config);
      } else {
        wx.updateAppMessageShareData(config);
      }
    });
    return this;
  }

  // 配置分享到朋友圈/QQ空间
  configTimeLineShare(config) {
    Weixin.shareTimeLineConfig = config;
    this.Processor.then(() => {
      if (Weixin.checkedAPIs["onMenuShareTimeline"]) {
        wx.onMenuShareTimeline(config);
      } else {
        wx.updateTimelineShareData(config);
      }
    });
    return this;
  }
}

export default new Weixin();
