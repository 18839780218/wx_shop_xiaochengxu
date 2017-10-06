//index.js  
//获取应用实例  
var app = getApp();
var con = require('../../data.js');
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
var sid0 = 0, sid1 = 0, sid2 = 0, sid3 = 0, selMoney, qianArr;
Page({
  firstIndex: -1,
  data:{
    bannerApp:true,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, //tab切换  
    productId:0,
    itemData:{},
    bannerItem:[],
    buynum:1,
    // 产品图片轮播
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // 属性选择
    firstIndex: -1,
    //准备数据
    //数据结构：以一组一组来进行设定
     // 商品属性
    commodityAttr:'',
    commodityAttr0: '',
    commodityAttr1: '',
    commodityAttr2: '',
    commodityAttr3: '',
    tiaojian0: false,
    tiaojian1: false,
    tiaojian2: false,
    tiaojian3: false,
    shuxingids: [],
    jiaqian: "",
    pingjia: [],
    pingjia_0: '',
    pingjia_1: '',
    pingjia_2: '',
    zPingjia: '',
    myHidden: false
  },

  // 弹窗
  setModalStatus: function (e) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    animation.translateY(300).step();
    
    this.setData({
      animationData: animation.export()
    })

    if (e.currentTarget.dataset.status == 1) {

      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },
  // 加减
  changeNum:function  (e) {
    var that = this;
    if (e.target.dataset.alphaBeta == 0) {
        if (this.data.buynum <= 1) {
            buynum:1
        }else{
            this.setData({
                buynum:this.data.buynum - 1
            })
        };
    }else{
        this.setData({
            buynum:this.data.buynum + 1
        })
    };
  },
  // 传值
  onLoad: function (option) {   
    //this.initNavHeight();
    var that = this;
    that.setData({
      productId: option.productId,
    });
    that.loadProductDetail();
    that.loadPingjia();

  },
  // 商品详情数据获取
  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: con.Index_getgoodsinfo,
      method:'GET',
      data: {
        wxappid: con.wyy_user_wxappid, goodsid: that.data.productId
      },
      header: {
        'Content-Type':  'application/json'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        // console.log(333333,res);
        if(status==1) {   
          var r = res.data.info
          var pro = res.data.pro;
          var content=r[0].g_content;
          //that.initProductData(data);
          WxParse.wxParse('content', 'html', content, that, 8);
          var commodityAttr = res.data.shuxing;
          var n = (res.data.info[0].shop_price - 0) + (res.data.attr_price - 0);

          selMoney= res.data.info[0].shop_price;
          qianArr = res.data.attr_arr;


    
          that.setData({
            itemData: r[0],
            bannerItem: r,
            jiaqian: n,
            commodityAttr: commodityAttr,
            commodityAttr0: commodityAttr[0],
            commodityAttr1: commodityAttr[1],
            commodityAttr2: commodityAttr[2],
            commodityAttr3: commodityAttr[3],
            shuxingids: res.data.shuxingids,
            myHidden: true

          });
        } else {
          wx.showToast({
            title:res.data.err,
            duration:2000,
          });
        }
      },
      error:function(e){
        wx.showToast({
          title:'网络异常！',
          duration:2000,
        });
      },
    });

  },
// 属性选择
  onShow: function () {
    
  },
  changeMoney: function(){
    var a = 0;
   if (qianArr[0] != undefined) {
      a+= (qianArr[0] - 0) + (selMoney - 0)
      // console.log(5, a);
   }
   if (qianArr[1] != undefined) {
     a += (qianArr[1] - 0)
    //  console.log(6, a);
   }
   if (qianArr[2] != undefined) {
     a += (qianArr[2] - 0)
    //  console.log(7, a);
   }
   if (qianArr[3] != undefined) {
     a += (qianArr[3] - 0)
    //  console.log(8, a);
   }
   this.setData({
     jiaqian: a
   })
  //  console.log(111, a);
  },
  howmuch0: function(e){
    var that = this;
    var money = e.currentTarget.dataset.money;
   
    qianArr[0] = money;

    // console.log(5555, money, qianArr[0]);
    that.changeMoney();
  },
  howmuch1: function (e) {
    var that = this;
    var money = e.currentTarget.dataset.money;
    qianArr[1] = money;

    // console.log(666, money, qianArr[1]);
    that.changeMoney();
   
  },
  howmuch2: function (e) {
    var that = this;
    var money = e.currentTarget.dataset.money;
    qianArr[2] = money;

    // console.log(666, money, qianArr[2]);
    that.changeMoney();

  },
  howmuch3: function (e) {
    var that = this;
    var money = e.currentTarget.dataset.money;
    qianArr[3] = money;

    // console.log(666, money, qianArr[3]);
    that.changeMoney();

  },
  radioChange0: function(e){
    sid0 = 0;
    var that = this;
    var t = true;
    var a = e.detail.value;
    sid0 = a;
    that.setData({
      tiaojian0: t
    })
    
  },
  radioChange1: function (e) {
    sid1 = 0;
    var that = this;
    var t = true;
    var a = e.detail.value;
    sid1 = a;
    that.setData({
      tiaojian1: t
    })
    // console.log(sid1);

  },
  radioChange2: function (e) {
    sid2 = 0;
    var that = this;
    var a = e.detail.value;
    var t = true;
    sid2 = a;
    that.setData({
      tiaojian2: t
    })
    // console.log(sid2);

  },
  radioChange3: function (e) {
    sid3 = 0;
    var that = this;
    var t = true;
    var a = e.detail.value;
    sid3 = a;
    that.setData({
      tiaojian3: t
    })
    // console.log(sid3);

  },


  addShopCart:function(e){ //添加到购物车
    var that = this;
    var a, b, c, d;
    var shuxingids = that.data.shuxingids;
    if (shuxingids != '') {
      if (sid0 != 0) {
        shuxingids[0] = sid0;

      }
      if (sid1 != 0) {
        shuxingids[1] = sid1;

      }
      if (sid2 != 0) {
        shuxingids[2] = sid2;

      }
      if (sid3 != 0) {
        shuxingids[3] = sid3;
      }
      if (shuxingids[0] != undefined) {
        a = shuxingids[0] + ","
      }
      if (shuxingids[1] != undefined) {
        a = a + shuxingids[1] + ","
      }
      if (shuxingids[2] != undefined) {
        a = a + shuxingids[2] + ","

      }
      if (shuxingids[3] != undefined) {
        a = a + shuxingids[3] + ","
      }

    }
      wx.request({
        url: con.Index_addgoodstocart,
        method: 'post',
        data: {
          wxappid: con.wyy_user_wxappid,
          fansid: app.globalData.fansid,
          goodsid: that.data.productId,
          number: that.data.buynum,
          shuxingid: a
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          var data = res.data;
          // console.log(data, 110011);
          if (data.isSuccess == 1) {
            var ptype = e.currentTarget.dataset.type;
            if (ptype == 'buynow') {
              // console.log(141414, that.data.productId)
              wx.redirectTo({
                url: '../order/pay?cartId=' + that.data.productId + "&&cgid=" + data.cgid
              });
              return;
            } else {
              wx.showToast({
                title: '加入购物车成功',
                icon: 'success',
                duration: 2000
              });
            }
          } else {
            wx.showToast({
              title: 'fansid或goosid有误',
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
  loadPingjia: function(){
    var that = this;
    wx.request({
      url: con.Index_getpingjialist,
      method: 'post',
      data: {
        wxappid: con.wyy_user_wxappid,
        goods_id: that.data.productId,
        count: 4
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      success: function(r){
        // console.log(111, d, that.data.productId); 
        var d = r.data.info;
        var zPingjia = (r.data.pingjia_0 - 0) + (r.data.pingjia_1 - 0) + (r.data.pingjia_2 - 0);
        //时间戳的处理  
        if (r.data.info != null) {
          for (var i = 0; i < r.data.info.length; i++) {
            r.data.info[i].addtime = that.toDate(r.data.info[i].addtime)
          }  
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
  toDate: function( time ){
    var n = time * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)  
  },
  bindChange: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  initNavHeight:function(){////获取系统信息
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  }, 
  bannerClosed:function(){
    this.setData({
      bannerApp:false,
    })
  },
  swichNav: function (e) {//点击tab切换
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
});
