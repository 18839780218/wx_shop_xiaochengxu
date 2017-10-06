// pages/pList/index.js
var app = getApp();
var con = require('../../data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id: '',
    pingjia: [],
    pingjia_0: '',
    pingjia_1: '',
    pingjia_2: '',
    zPingjia: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.goodsid;
    that.setData({
      goods_id: id
    })
    that.loadPingjia();
  },
  loadPingjia: function () {
    var that = this;
    wx.request({
      url: con.Index_getpingjialist,
      method: 'post',
      data: {
        wxappid: con.wyy_user_wxappid,
        goods_id: that.data.goods_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (r) {
        // console.log(111, r, that.data.productId);
        var d = r.data.info;
        var zPingjia = (r.data.pingjia_0 - 0) + (r.data.pingjia_1 - 0) + (r.data.pingjia_2 - 0);
        //时间戳的处理  
        for (var i = 0; i < r.data.info.length; i++) {

          r.data.info[i].addtime = that.toDate(r.data.info[i].addtime)
        }
        that.setData({
          pingjia: d,
          pingjia_0: r.data.pingjia_0,
          pingjia_1: r.data.pingjia_1,
          pingjia_2: r.data.pingjia_2,
          zPingjia: zPingjia
        })
      }
    })

  },
  toDate: function (time) {
    var n = time * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
  
  onShareAppMessage: function () {
  
  }
})