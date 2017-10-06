// app.js
var con = require('data.js');
App({
  d: {
    // hostUrl: 'https://wxplus.paoyeba.com/index.php',
    // hostImg: 'http://img.ynjmzb.net',
    // hostVideo: 'http://zhubaotong-file.oss-cn-beijing.aliyuncs.com',
    userId: 1,
    fansid: 0,
    appId: "",
    appKey: "",
    ceshiUrl: 'https://wxplus.paoyeba.com/index.php',
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //login
    this.getUserInfo()
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (o) {
          // console.log(o);
          wx.getUserInfo({
            success: function (res) {
              wx.request({
                url: con.index_slogin,
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  code: o.code,
                  wxappid: con.wyy_user_wxappid,
                  nickname: res.userInfo.nickName,
                  pic: res.userInfo.avatarUrl
                },
                success: function (res) {
                  that.globalData.fansid = res.data.fansid;
                  that.globalData.openid = res.data.openid;

                  console.log(res.data.openid);
                  // console.log(222222,res.data.openid, res);
                  // wx.setStorage({
                  //   key: 'openid',
                  //   data: res.data.openid,
                  // })
                }
              })

              that.globalData.userInfo = res.userInfo
              // console.log(33333333,res.userInfo);
            }
          })
        }
      });
    }
  },


  getOrBindTelPhone: function (returnUrl) {
    var user = this.globalData.userInfo;
    if (!user.tel) {
      wx.navigateTo({
        url: 'pages/binding/binding'
      });
    }
  },

  globalData: {
    userInfo: null,
    fansid: "",
    openid: ""
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }

});





