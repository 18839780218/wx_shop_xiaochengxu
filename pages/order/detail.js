var app = getApp();
var con = require('../../data.js');
// pages/order/detail.js
Page({
  data:{
    orderId:0,
    orderData:{},
    proData:[],
    total_price: '',
    remark: '',
    time: '',
    yunfei: '',
    judge: 0,
    youhui: 0
  },
  onLoad:function(options){
    this.setData({
      orderId: options.orderId,
      judge: options.judge
    })
    this.loadProductDetail();
  },
  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: con.Index_getorderbysn,
      method:'post',
      data: {
        wxappid: con.wyy_user_wxappid,
        ordersn: that.data.orderId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var status = res.data.status;
        // console.log(1111, res);
        if(status==1){
          var pro = res.data.info;
          var ord = res.data.wuliu;
          var price = res.data.order_price;
          var mark = res.data.remark;
          var yunfei = res.data.order.yunfei;
          var youhui = res.data.order.youhui;
          var t = new Date(parseInt(res.data.createtime) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " "); 
          var sn = res.data.order.order_sn
         
          // console.log(t)
          that.setData({
            orderData: ord,
            proData:pro,
            total_price: price,
            remark: mark,
            time: t,
            yunfei: yunfei,
            ordersn: sn,
            youhui: youhui
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
      }
    });
  },

})