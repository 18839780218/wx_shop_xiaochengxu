// pages/user/user.js
var app = getApp();
var con = require('../../data.js');
Page( {
  data: {
    userInfo: {},
    orderInfo:{},
    num1: 0,
    num2: 0,
    num3: 0,
    num4: 0,
    myHidden: false,
    // projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
    userListInfo: [ {
        icon: '../../images/iconfont-dingdan.png',
        text: '我的订单',
        isunread: true,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-card.png',
        text: '我的代金券',
        isunread: false,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-icontuan.png',
        text: '我的拼团',
        isunread: true,
        unreadNum: 1
      }, {
        icon: '../../images/iconfont-shouhuodizhi.png',
        text: '收货地址管理'
      }, {
        icon: '../../images/iconfont-kefu.png',
        text: '联系客服'
      }, {
        icon: '../../images/iconfont-help.png',
        text: '常见问题'
      }],
       loadingText: '加载中...',
       loadingHidden: false,
  },
  onLoad: function () {
      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
          userInfo:userInfo,
          loadingHidden: true
        })
      });

      this.loadOrderStatus();
      this.banquan();
  },
  onShow:function(){
    this.loadOrderStatus();
  },
  loadOrderStatus:function(){
    //获取用户订单数据
    var that = this;
    wx.request({
      url: con.Index_getfansorder,
      method:'post',
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid:  app.globalData.fansid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        // console.log(222, res);
        
        if(status==1){
          var list = res.data.info;
          var n1 = list.daifu;
          var n2 = list.daishou;
          var n3 = list.wancheng;
          var n4 = list.tuikuan; 
          n1= n1 == null ? 0 : n1.length;
          n2 = n2 == null ? 0 : n2.length;
          n3 = n3 == null ? 0 : n3.length;
          n4 = n4 == null ? 0 : n4.length;
          that.setData({
              num1: n1,
              num2: n2,
              num3: n3,
              num4: n4,
              myHidden: true
          })
          // console.log(333, n1, n2);
          // console.log(11, list)
        }else{
          wx.showToast({
            title: '非法操作.',
            duration: 2000
          });
        }
      },
      error:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  banquan: function(){
    // 获取域名接口
    var that = this;
    wx.request({
      url: con.get_copyright,
      method: 'GET',
      data: { wxappid: con.wyy_user_wxappid },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          yname: res.data
        })
        console.log(res.data)
      }

    })
  },

  onShareAppMessage: function () {
    // return {
    //   title: '宠物美容学校',
    //   path: '/pages/index/index',
    //   success: function (res) {
    //     // 分享成功
    //   },
    //   fail: function (res) {
    //     // 分享失败
    //   }
    // }
  }
})