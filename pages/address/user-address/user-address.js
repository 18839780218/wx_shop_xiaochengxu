// pages/address/user-address/user-address.js
var app = getApp();
var con = require('../../../data.js');
Page({
  data: {
    address: [],
    radioindex: '',
    pro_id:0,
    num:0,
    cartId:0,
    cgids: 0,
    default_id: 0,
    default_add: []
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var cartId = options.cartId;
    var cgid = options.cgid;
    // console.log(222, cartId);
    wx.request({
      url: con.Index_getFansRecipients,
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var address = res.data.info;
        if (res.data.default_info == null && res.data.info == null ){
           wx.navigateTo({
             url: '../address?cartId=' + cartId + "&&cgid=" + cgid,
           })
          //  return;
        }
        console.log(res);
        if (address == '') {
          var address = []
        }
        
        that.setData({
          address: address,
          cartId: cartId,
          cgids: cgid,
          default_id: res.data.default_id,
          default_add: res.data.default_info,

        })
       
        // console.log(444444, res.data.default_info)
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    
  },

  onReady: function () {
    // 页面渲染完成
  },

  // 默认收获地址设置
  setDefault: function(e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    wx.request({
      url: con.Index_SetDefaultRecipients,
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid,
        re_id:addrId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        // console.log(res, 666);
        var status = res.data.status;
        var cartId = that.data.cartId;
        var cgids = that.data.cgids;
        if(status==1){
          if (cartId) {
            wx.redirectTo({
              url: '../../order/pay?cartId=' + cartId + '&&cgid=' + cgids,
            });
            return false;
          }

          wx.showToast({
            title: '操作成功！',
            duration: 2000
          });
          
          that.DataonLoad();
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
    })
  },
  delAddress: function (e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    // console.log(1111);
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        // console.log(2220);
        res.confirm && wx.request({
          url: con.Index_delRecipients,
          data: {
            wxappid: con.wyy_user_wxappid,
            fansid: app.globalData.fansid,
            re_id: addrId
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {// 设置请求的 header
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          
          success: function (res) {
            // console.log(333, res);
            // success
            // var that = this;
            var status = res.data.status;
            if(status==1){
              that.DataonLoad();
              // console.log(1212121)
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
  DataonLoad: function () {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    // var cartId = options.cartId;
    // console.log(app.d.userId);
    wx.request({
      url: con.Index_getFansRecipients,
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        // success
        var address = res.data.info;
        // console.log(res);
        if (address == '') {
          var address = []
        }

        that.setData({
          address: address,
          default_id: res.data.default_id,
          default_add: res.data.default_info,

        })
        // console.log(444444, res.data.default_info)
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    
  },
})