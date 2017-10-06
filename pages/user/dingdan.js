// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var common = require("../../utils/common.js");
var con = require('../../data.js');
Page({  
  data: {  
    winWidth: 0,  
    winHeight: 0,  
    // tab切换  
    currentTab: 0,  
    isStatus:'pay',//10待付款，20待发货，30待收货 40、50已完成
    page:0,
    refundpage:0,
    orderList0:[],
    orderList1:[],
    orderList2:[],
    orderList3:[],
    orderList4:[],
    myHidden: false
  },  
  onLoad: function(options) {  
    this.initSystemInfo();
    this.setData({
      currentTab: parseInt(options.currentTab),
      isStatus:options.otype
    });

    if(this.data.currentTab == 4){
      this.loadReturnOrderList();
    }else{
      this.loadOrderList();
    }
  },  
  getOrderStatus:function(){
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ?2 :this.data.currentTab == 3 ? 3:0;
  },

//取消订单
removeOrder:function(e){
    var that = this;
    var ordersn = e.currentTarget.dataset.ordersn;
    wx.showModal({
      title: '提示',
      content: '你确定要取消订单吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: con.Index_cancelOrder,
          method:'post',
          data: {
            wxappid: con.wyy_user_wxappid,
            ordersn: ordersn
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            // console.log(1111, res);
            if(status == 1){
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
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

      }
    });
  },

  //确认收货
recOrder:function(e){
    var that = this;
    var ordersn = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定已收到宝贝吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: con.Index_shouhuo,
          method:'post',
          data: {
            wxappid: con.wyy_user_wxappid,
            ordersn: ordersn
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if(status == 1){
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
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

      }
    });
  },

  loadOrderList: function(){
    var that = this;
    wx.request({
      url: con.Index_getfansorder,
      method: 'post',
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        var list = res.data.info;
        // console.log(1111, list.daifu, list.tuikuan);
        switch(that.data.currentTab){
          case 0:
            that.setData({
              orderList0: list.daifu,
              myHidden: true
            });
            break;
          case 1:
            that.setData({
              orderList1: list.daifa,
              myHidden: true
            });
            break;  
          case 2:
            that.setData({
              orderList2: list.daishou,
              myHidden: true
            });
            break;
          case 3:
            that.setData({
              orderList3: list.wancheng,
              myHidden: true
            });
            break;
          case 4:
            that.setData({
              orderList4: list.tuikuan,
              myHidden: true
            });
            break;  
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

loadReturnOrderList:function(){
    var that = this;
    wx.request({
      url: con.Index_getfansorder,
      method:'post',
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.info.tuikuan;
        var status = res.data.info.tuikuan;
        if(status != null){
          that.setData({
            orderList4: that.data.orderList4.concat(data),
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
  
  // returnProduct:function(){
  // },
  initSystemInfo:function(){
    var that = this;  
  
    wx.getSystemInfo( {
      success: function( res ) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }    
    });  
  },
  bindChange: function(e) {  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  },  
  swichNav: function(e) {  
    var that = this;  
    if( that.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else { 
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
      });

      //没有数据就进行加载
      switch(that.data.currentTab){
          case 0:
            !that.data.orderList0.length && that.loadOrderList();
            break;
          case 1:
            !that.data.orderList1.length && that.loadOrderList();
            break;  
          case 2:
            !that.data.orderList2.length && that.loadOrderList();
            break;
          case 3:
            !that.data.orderList3.length && that.loadOrderList();
            break;
          case 4:
            that.data.orderList4.length = 0;
            that.loadReturnOrderList();
            break;
        }
    };
  },
  /**
   * 微信支付订单
   */
  // payOrderByWechat: function(event){
  //   var orderId = event.currentTarget.dataset.orderId;
  //   this.prePayWechatOrder(orderId);
  //   var successCallback = function(response){
  //     console.log(response);
  //   }
  //   common.doWechatPay("prepayId", successCallback);
  // },

  payOrderByWechat: function (e) {
    // var order_id = e.currentTarget.dataset.orderId;
    var order_sn = e.currentTarget.dataset.ordersn;
    if(!order_sn){
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    wx.request({
      url: con.Index_getpaycanshu,
      data: {
        wxappid: con.wyy_user_wxappid,
        openid: app.globalData.openid,
        ordersn: order_sn
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data != null) {
          var a = res.data;
          wx.requestPayment({
            "appId": a.appId,
            "nonceStr": a.nonceStr,
            "package": a.package,
            "signType": "MD5",
            "timeStamp": a.timeStamp,
            "paySign": a.paySign,
            success: function (res) {
              // console.log(1111, res);
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              // 支付成功后改变此订单的状态
              wx.request({
                url: con.Index_uporder_yifukuan,
                data: {
                  wxappid: con.wyy_user_wxappid,
                  ordersn: order_sn
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }, // 设置
                success: function (r) {
                  // console.log(220, r);
                }
              })

              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=deliver',
                });
              }, 2500);
            },
            fail: function (res) {
              wx.showToast({
                title: '支付失败',
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: '支付参数错误',
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

})