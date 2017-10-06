var app = getApp();
var con = require('../../data.js');
// pages/cart/cart.js
Page({
  data:{
    page:1,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    total: 0,
    carts: [],
    goodscount: 0,
    loadingHidden: false,
    isShow: false,
    selectedAllStatus: false,
  },

bindMinus: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var cgid = e.currentTarget.dataset.cgid;
    // console.log(index, 9999);
    var num = that.data.carts[index].goods_num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num --;
      var cart_id = e.currentTarget.dataset.cartid;
      wx.request({
        url: con.Index_subgoodsfromcart,
        method: 'post',
        data: {
          wxappid: con.wyy_user_wxappid,
          fansid: app.globalData.fansid,
          // num:num,
          goodsid: cart_id,
          cartgoodsid: cgid
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.loadProductData();
          var status = res.data.status;
          if (status == 1) {
            // 只有大于一件的时候，才能normal状态，否则disable状态
            var minusStatus = num <= 1 ? 'disabled' : 'normal';
            // 购物车数据
            var carts = that.data.carts;
            carts[index].num = num;
            // 按钮可用状态
            var minusStatuses = that.data.minusStatuses;
            minusStatuses[index] = minusStatus;
            // 将数值与状态写回
            that.setData({
              minusStatuses: minusStatuses
            });
            that.sum();
          } else {
            wx.showToast({
              title: '操作失败！',
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
    // console.log(num, 555555);
    
},

bindPlus: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].goods_num;
    // 自增
    num ++;
    // console.log(num, 44444);
    var cart_id = e.currentTarget.dataset.cartid;
    var tid = e.currentTarget.dataset.tid;
    wx.request({
      url: con.Index_addgoodstocart,
      method:'post',
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid,
        // num:num,
        goodsid: cart_id,
        shuxingid: tid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if(status==1){
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.carts;
          carts[index].num = num;
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses
          });
          that.sum();
          that.loadProductData();
        }else{
          wx.showToast({
            title: '操作失败！',
            duration: 2000
          });
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
}, 
bindCheckbox: function(e) {
  /*绑定点击事件，将checkbox样式改变为选中与非选中*/
  //拿到下标值，以在carts作遍历指示用
  var index = parseInt(e.currentTarget.dataset.index);
  //原始的icon状态
  var selected = this.data.carts[index].selected;
  var carts = this.data.carts;
  // 对勾选状态取反
  carts[index].selected = !selected;
  // 写回经点击修改后的数组
  this.setData({
    carts: carts
  });
  this.sum()
},
bindSelectAll: function() {
   // 环境中目前已选状态
   var selectedAllStatus = this.data.selectedAllStatus;
   // 取反操作
   selectedAllStatus = !selectedAllStatus;
   // 购物车数据，关键是处理selected值
   var carts = this.data.carts;
   // 遍历
   for (var i = 0; i < carts.length; i++) {
     carts[i].selected = selectedAllStatus;
   }
   this.setData({
     selectedAllStatus: selectedAllStatus,
     carts: carts
   });
   this.sum()
 },

bindCheckout: function() {
   // 初始化toastStr字符串
   var toastStr = '';
   var cgid = '';
   // 遍历取出已勾选的cid
   for (var i = 0; i < this.data.carts.length; i++) {
     if (this.data.carts[i].selected) {
       toastStr += this.data.carts[i].id;
       toastStr += ',';
       cgid += this.data.carts[i].cgid;
       cgid += ','

     }
     
   }
   if (toastStr==''){
     wx.showToast({
       title: '请选择要结算的商品！',
       duration: 2000
     });
     return false;
   }
   //存回data
   wx.navigateTo({
     url: '../order/pay?cartId=' + toastStr + '&&cgid=' + cgid,
   })
   this.setData({
     total: 0
   })
 },

 bindToastChange: function() {
   this.setData({
     toastHidden: true
   });
 },

sum: function() {
    var carts = this.data.carts;
    // console.log(89898989, carts);
    // 计算总金额
    var total = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        total += carts[i].goods_num * ((carts[i].shop_price - 0) + (carts[i].attr_price - 0));
      }
    }
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: '¥ ' + total
    });
  },

onLoad:function(options){
    this.setData({
      selectedAllStatus: false
    })
    this.loadProductData();
    this.sum();
},

onShow:function(){
  this.setData({
    selectedAllStatus: false
  })
  this.loadProductData();
},

removeShopCard:function(e){
    var that = this;
    var cardId = e.currentTarget.dataset.cartid;
    var cgid = e.currentTarget.dataset.cgid;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: con.Index_delgoodsfromcart,
          method:'post',
          data: {
            wxappid: con.wyy_user_wxappid,
            fansid: app.globalData.fansid,
            goodsid: cardId,
            cartgoodsid: cgid
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.data;
            if(data.status == 1){
              //that.data.productData.length =0;
              that.loadProductData();
            }else{
              wx.showToast({
                title: '操作失败！',
                duration: 2000
              });
            }
          },
        });
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

// 数据案例 购物车数据展示接口
  loadProductData:function(){
    var that = this;
    wx.request({
      url: con.Index_getfanscartlist,
      method:'post',
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var cart = res.data.info;
        var goodscount = res.data.goodscount
        // console.log(78787878, cart, res);
        that.setData({
          carts:cart,
          goodscount: goodscount
        });
        setTimeout(function(){
          that.setData({
           loadingHidden: true
          });
        }, 1000)

        //endInitData
        // console.log(goodscount)
      },
    });
  },
})