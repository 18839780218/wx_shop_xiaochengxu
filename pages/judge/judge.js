// pages/judge/judge.js
var app = getApp();
var con = require('../../data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    proData: [],
    pingjia: 2,
    goodsid: '',
    ordersn: '',
    ogid: ''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var goodsid = options.goodsid;
    var ordersn = options.ordersn;
    var ogid = options.ogid;
    that.setData({
      goodsid: goodsid,
      ordersn: 　ordersn,
      ogid: ogid
    })
  },
  radioChange: function(e) {
    var that =this;
    var zhi = e.detail.value;
    // console.log(2, zhi);
    that.setData({
      pingjia: zhi
    })

  },
  formSubmit: function(e){
     var that  =this;
     var content = e.detail.value.content;
     
    //  console.log(3, content, that.data.pingjia);
     wx.request({
       url: con.Index_pingjia_add,
       method: 'post',
       data: {
         wxappid: con.wyy_user_wxappid,
         openid: app.globalData.openid,
         pingjia: that.data.pingjia,
         content: content,
         goods_id: that.data.goodsid,
         ordersn: that.data.ordersn,
         ogid: that.data.ogid
       },
       header: {
         'Content-Type': 'application/x-www-form-urlencoded'
       },
       success: function(r){
        //  console.log(r);
         if(r.data.info == 'success') {
           wx.showToast({
             title: '评价完成',
           });
           wx.switchTab({
             url: '../user/user',
           })
         }
       }
     })
  },
  onShareAppMessage: function () {
     
  }
})