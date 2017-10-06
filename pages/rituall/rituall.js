// pages/panic/panic.js
var app = getApp();
var con = require('../../data.js');
Page({
  data:{
    vou:[],
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: con.Index_my_youhui,
      method:'POST',
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        var vou = res.data.info;
        // var status = res.data.status;
        console.log(110, res);
        
        if(vou != null){
          that.setData({
            vou:vou,
          });
        }else{
          wx.showToast({
            title: vou,
            duration: 2000
          });
        }
        //endInitData
      },
      error:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  }
})