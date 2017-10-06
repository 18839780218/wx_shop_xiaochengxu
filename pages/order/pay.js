var app = getApp();
var con = require('../../data.js');
var goodsinfo = [], re_id = '', recipients = {}, openid = '', errMsg;

// pages/order/downline.js
Page({
  data:{
    itemData:{},
    userId:0,
    paytype:'weixin',//0线下1微信
    remark:'',
    cartId:0,
    addrId:0,//收货地址//测试--
    btnDisabled:false,
    productData:[],
    address:'',
    total:0,
    total1: 0, 
    vprice:0,
    vid:0,
    addemt:1,
    vou:[],
    goodsArr: [],
    default_id: 0,
    orderInfo: {
    },
    yunfei: '',
    limit: '',
    base: '',
    cgids:[],
    vouJian: 0,
    sta: '',
    myHidden: false,
    mNum: 0,
    prepay_id: '',
    showModalStatus:false,
    myOrderNum: '',
    myDate: ''
  },
  onLoad:function(options){
    var uid = con.wyy_user_wxappid;
    var oId = options.cartId.split(",");
    var cg = options.cgid;
    // var d = oId.substring(0, oId.length - 1).split(",");
    for( var i = 0; i < oId.length; i++) {
       oId[i] == "" ? oId.pop() : oId[i];
    }
    var m = cg.split(",")
    // console.log(222, oId);
    this.setData({
      cartId: oId,
      userId: uid,
      cgids: m
    });
    this.loadProductDetail();
    this.loadProductData();
    // this.wuliu();
    this.sum();
    // console.log(11110);
    goodsinfo = [];
    // this.util();
    

  },
  loadProductDetail:function(){
    var that = this;
    var recipients = {}, remark = '';
       
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
          // console.log(res);
          var address = res.data.default_info;
          var id = res.data.default_id;
          // console.log(787878, address, res);
          that.setData({
            address: address,
            default_id: id,
          })

          // canshu 
          re_id = id;
          
      
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

  //获取已选择结算商品的信息
  loadProductData: function () {
    var that = this;
    var goodsid = '', num = '', price = '', attr = '';
    var str;
    // console.log(888888, JSON.stringify(that.data.cartId))
    wx.request({
      url: con.index_getcartgoodsbySelected,
      method: 'post',
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid,
        goodsidarr: JSON.stringify(that.data.cartId),
        cgids: JSON.stringify(that.data.cgids),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var cart = res.data.info;
        // console.log(78787878, cart, cart[0].id, res);
        that.setData({
          productData: cart
        });

        var cgid = that.data.cgids;
        var mNum = 0;
        // endInitData
        for (var i = 0; i < cart.length; i++) {
          var test = {};
          test.goodsid = cart[i].id;
          test.num = cart[i].goods_num;
          test.price = cart[i].shop_price;
          test.attr = attr;
          test.cgid = cgid[i];
          mNum += cart[i].goods_num
          goodsinfo.push(test);
        }
        // console.log(11111, cgid);
        that.setData({
          mNum: mNum
        })
      
        that.sum();
        that.wuliu();
      },
    });
  },

  sum: function () {
    var carts = this.data.productData;
    // console.log(89898989, carts);
    // 计算总金额
    var total = 0, total1 = 0;
    for (var i = 0; i < carts.length; i++) {
      total += (carts[i].goods_num * ((carts[i].shop_price - 0) + (carts[i].attr_price - 0)));
      total1 += carts[i].goods_num * ((carts[i].shop_price - 0) + (carts[i].attr_price - 0));
    }
    total -= this.data.vouJian;
    // 写回经点击修改后的数组
    this.setData({
      productData: carts,
      total:total,
      total1: total1
    });
  },

  remarkInput:function(e){
    this.setData({
      remark: e.detail.value,
    })
  },

 //微信支付
  createProductOrderByWX:function(e){
    this.setData({
      paytype: 'weixin',
    });
  
    this.createProductOrder();
  },

  //线下支付
  createProductOrderByXX:function(e){
    this.setData({
      paytype: 'cash',
    });
    wx.showToast({
      title: "线下支付开通中，敬请期待!",
      duration: 3000
    });
    return false;
    this.createProductOrder();  

    },

  //确认订单
  createProductOrder:function(e){
    
    this.setData({
      btnDisabled:false,
    })

    //创建订单
    var that = this;
    var p = that.data.remark;
    var orderInfo = {},remark = '', fansid= '';
    // console.log(66661, p)
    recipients.re_id = re_id;
    recipients.remark = p;
    // console.log(66662, recipients);
   
    // 拼接orderInfo 参数
    orderInfo.fansid = app.globalData.fansid;
    orderInfo.goodsinfo = goodsinfo;
    orderInfo.recipients = recipients;
    orderInfo.totalprice = that.data.total1;
    // console.log(33333, orderInfo.totalprice, orderInfo);

    var add = that.data.address;
    // console.log(3333, add);
    if ( add==null) {
      wx.showToast({
        title: '请添加地址',
      })
    //  console.log('走没有走');
    }  else{
      wx.request({
        url: con.Index_addorder,
        method: 'post',
        data: {
          wxappid: con.wyy_user_wxappid,
          orderInfo: JSON.stringify(orderInfo),
          youhuiid: that.data.vid

          // price: that.data.total,//总价
          // vid: that.data.vid,//优惠券ID
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data        
          var data = res.data;
          var sn = data.order_sn;
          errMsg = res.data.info;
          console.log(441, res, errMsg);
          if (data.isSuccess == 1 ) {
            // 创建订单成功
            if (that.data.paytype == 'weixin') {
              //微信支付
              that.wxpay(sn);
            }
          } else {
            wx.showToast({
              title: '添加订单失败',
              duration: 2500
            });
            wx.redirectTo({
              url: '../user/dingdan?currentTab=0&otype=pay',
            });
            console.log('跳转22');
          }
          that.setData({
            myOrderNum: sn
          })
          that.clearSelectedGoods();
          goodsinfo = [];
          recipients = {};
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！err:createProductOrder',
            duration: 2000
          });
        }
      });
    }
  


    
  },
  
  //调起微信支付
  wxpay: function(order){
    var that = this;
    // console.log(177, app.globalData.openid);
      wx.request({
        url: con.Index_getpaycanshu,
        data: {
          wxappid: con.wyy_user_wxappid,
          openid: app.globalData.openid,
          ordersn: order
        },
        method: 'POST', 
        header: {
          'Content-Type':  'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){
          // console.log(133, res);
          if(res.data != null){
            var a=res.data;
            that.setData({
              prepay_id: a.package
            })
            wx.requestPayment({
              "appId": a.appId,
              "nonceStr": a.nonceStr,    
              "package": a.package,
              "signType":"MD5",
              "timeStamp": a.timeStamp,
              "paySign": a.paySign,
              success: function(res){
                console.log(1111, res);
                // wx.showToast({
                //   title:"支付成功!",
                //   duration:2000,
                // });
                that.setData({
                  showModalStatus: true
                })
                that.util();
                
                 // 支付成功后改变此订单的状态
                 wx.request({
                   url: con.Index_uporder_yifukuan,
                   data: {
                     wxappid: con.wyy_user_wxappid,
                     ordersn: order
                   },
                   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                   header: {
                     'Content-Type': 'application/x-www-form-urlencoded'
                   }, // 设置
                   success: function(r) {
                    console.log(220, r);
                   }
                 })
                //  that.submitInfo();
              },
              fail: function(res) {
                wx.showToast({
                  title:'支付参数错误',
                  duration:3000
                });
                wx.redirectTo({
                  url: '../user/dingdan?currentTab=0&otype=pay',
                });
                console.log('跳转1')

              }
            })
          }else{
            wx.showToast({
              title: '支付参数错误',
              duration: 2000
           });
          }
        },
        fail: function() {
          // fail
          wx.showToast({
            title: '网络异常',
            duration: 2000
          });
        }
      })
  },
  DataonLoad: function () {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
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
        var address = res.data.adds;
        // console.log(4545, address);
        if (address == '') {
          var address = []
        }
        that.setData({
          address: address,
        })
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

// 结算过的商品从购物车中清空
  clearSelectedGoods: function () {
    var that = this;
    wx.request({
      url: con.Index_clearcartgoods,
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid,
        goodsid: JSON.stringify(that.data.cartId),
        cgid: JSON.stringify(that.data.cgids)
      },
      method: 'POST',
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (r) {
        // console.log(7777, r, that.data.cartId);
          
      }

    })
  },


  // 物流满减信息
  wuliu: function() {
    var that = this;
    wx.request({
      url: con.Index_getyunfeibyid,
      data: {
        wxappid: con.wyy_user_wxappid,
      },
      method: 'POST', 
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (r) {
        var b = r.data.yunfei_base;
        var l = r.data.yunfei_limit;
        var t = that.data.total;
        // console.log(7777, r);
        var m = r.data.yunfei_limit

        that.sum();

        if (l != 0.00 && t > m) {
          that.setData({
            limit: l,
            base: b,
            yunfei: 0
          })
        } else {
          that.setData({
            limit: l,
            base: b,
            yunfei: b
          })
        }
        // console.log(that.data.limit, that.data.yunfei)
        that.setData({
          myHidden: true
        })
       
        that.huoquJuan();
        
      }

    })
  },
  // 获取优惠劵信息
  huoquJuan: function(e){
    var that = this;
    var pri = (that.data.total - 0) + (that.data.yunfei - 0);
    console.log(112, pri)

    wx.request({
      url: con.Index_my_ok_youhuilist,
      data: {
        wxappid: con.wyy_user_wxappid,
        fansid: app.globalData.fansid,
        price: pri
      },
      method: 'POST',
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(r) {
        console.log('号', r);
        that.setData({
          vou: r.data.info,
          sta: r.data.status
        })
      }

  })
  },
  //选择优惠券
  getvou: function (e) {
    var vid = e.currentTarget.dataset.id;
    var diyong = e.currentTarget.dataset.idx - 0;
    // console.log(1111, vid, diyong);
    if (vid == 0){
      this.setData({
        vid: vid,
        vouJian: 0
      })
    } else {
      this.setData({
        vid: vid,
        vouJian: diyong
      })
    }
   
    this.sum();
  },

  // 模板消息
  submitInfo: function (e) {
    var that = this;
    this.CurentTime();
    var price = (that.data.total - 0) + (that.data.yunfei - 0);
    console.log(1, price, that.data.mNum);
    wx.request({
      url: "https://wxapi.weiyunyi.com/wap.php/Base/send_message",
      data: {
          type:'pay',
          name: "您有一个新的订单,请注意查收!",
          time: that.data.myDate,
          price: price,
          num: that.data.myOrderNum,
          wxappid: con.wyy_user_wxappid
      },
      method: 'POST',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        // var fId = that.data.prepay_id.substring(10);
        var fId = e.detail.formId;
        // var fObj = e.detail.value;
        console.log(res);
        var id = res.data.template_id;console.log(id);
        
        var l = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + res.data.token;
        
        var d = {
          touser: app.globalData.openid,
          template_id: id,//这个是1、申请的模板消息id，  
          page: '../index/index',
          form_id: fId,
          data: res.data.data,
          color: '#ccc',
          // emphasis_keyword: 'keyword1.DATA'
        }
        console.log(d,l);
        wx.request({
          url: l,
          data: d,
          method: 'POST',
          success: function (res) {
            console.log("push msg");
            console.log(res);
          },
          fail: function (err) {
            // fail  
            console.log("push err")
            console.log(err);
          }
        });
      },
      fail: function (err) {
        // fail  
        console.log("push err")
        console.log(err);
      }
    }); 
    
    },

    // 模态
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  } ,
  showOrClose: function(){
    this.setData({
      showModalStatus: false
    })
    setTimeout(function () {
      wx.navigateTo({
        url: '../user/dingdan?currentTab=1&otype=deliver',
      });
    }, 2500);
    // console.log('别跳');
  },
  // 获取当前日期
  CurentTime: function (){ 
    var now = new Date();
        
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();           //秒

    var clock = year + "-";
        
    if(month < 10)
            clock += "0";
        
    clock += month + "-";
        
    if(day < 10)
            clock += "0";
            
    clock += day + " ";
        
    if(hh < 10)
            clock += "0";
            
    clock += hh + ":";
    if(mm < 10) clock += '0'; 
    clock += mm + ":"; 
         
    if(ss < 10) clock += '0'; 
    clock += ss; 
    this.setData({
      myDate: clock
    })
  }

});