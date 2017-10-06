// pages/wuliu/wuliu.js
var con = require('../../data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    info: '',
    list: [],
    first: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sn = options.ordersn;
    console.log(1, sn);
    wx.request({
      url: con.Index_getkuaidibyordersn,
      method: 'POST',
      data: {
        wxappid: con.wyy_user_wxappid,
        ordersn: sn
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(r) {
        console.log(2, r)
        var info = r.data.info;
        var data = r.data.info.data;
        var first = r.data.info.data.shift();
        console.log(3, first, data);
        that.setData({
          info: info,
          list: data,
          first: first
        });
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          });
        }, 1500)
      },
      fail: function(e){
        wx.showToast({
          title: '网络错误',
          duration: 2000
        })
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})