var app = getApp();
var con = require('../../data.js');
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    loadingHidden: false,
    productData: [],
    proCat:[],
    page: 8,
    index: 2,
    brand:[],
    length: 0,
    // 滑动
    imgUrl: [],
    kbs:[],
    lastcat:[],
    course:[],
    youList: [],
    navList: [],
    adver: []
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: con.Index_getongoods,
      method:'GET',
      data: { wxappid: con.wyy_user_wxappid, count:4},
      header: {
        'Content-Type':  'application/json'
      },
      success: function (res) {
        that.setData({
          productData: res.data.info
        });
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          });
        }, 1500)
        //endInitData
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    }),

        wx.request({
          url: con.Index_getongoods,
          method: 'GET',
          data: { wxappid: con.wyy_user_wxappid},
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {

            that.setData({
              length: res.data.info.length

            });
            // console.log(length);
            //endInitData
          },
          fail: function (e) {
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          },
        }),


        wx.request({
          url: con.Shop_getslide,
          method: 'GET',
          data: { wxappid: con.wyy_user_wxappid},
          header: {
            'Content-Type': 'application/json'
          },
          success: function(r){

            var img = r.data.info;
            //  console.log(img)
            that.setData({
              imgUrls: img
            })
          }
        })


    this.getyouhuijuan();
    this.getType();
    this.getAd();
  },
  // 广告信息
  getAd: function(){
    var that = this;
    wx.request({
      url: con.Index_getad,
      method: 'GET',
      data: {
        wxappid: con.wyy_user_wxappid
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res);
        var data = res.data.info;
        that.setData({
          adver: data
        })
      }

    })

  },
  //跳转商品列表页
  listdetail: function (e) {
    // console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../listdetail/listdetail?title=' + e.currentTarget.dataset.title,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  // 获取分类图标
  getType: function () {
    var that = this;
    wx.request({
      url: con.Index_getcategory,
      method: 'GET',
      data: { wxappid: con.wyy_user_wxappid },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //--init data
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.info;
          console.log(1212, res);
          that.setData({
            navList: list
          })

        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
        // console.log(list. currType)

      },
      error: function (e) {
        wx.showToast({
          title: '网络异常!',
          duration: 2000,
        });
      },

    });
  },
  // 跳转筛选页面
  goToFilter: function(e){
    var catid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../filter/filter?catid=' + catid,
    })
  },

  //点击加载更多
  getMore: function (e) {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: con.Index_getongoods,
      method: 'GET',
      data: { wxappid: con.wyy_user_wxappid, count: page },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data.info)
        var prolist = res.data.info.length;
        // console.log(prolist,page);
        if (prolist < page) {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page + 4,
          productData: res.data.info
        });
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  // 获取优惠劵信息
  getyouhuijuan: function(e) {
    var that= this;
    wx.request({
      url: con.Index_discountlist,
      method: 'POST',
      data: { wxappid: con.wyy_user_wxappid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (r) {

        var data = r.data.list;
        // console.log(r, data);

        //时间戳的处理  
        if (data != null) {
          for (var i = 0; i < data.length; i++) {
            data[i].q_begin_time = that.toDate(data[i].q_begin_time);
            data[i].q_end_time = that.toDate(data[i].q_end_time)
          }
        }
        that.setData({
          youList: data,
        })

      }
    })
  },
  // 领取优惠劵
  myVou: function(e){
    var id = e.currentTarget.dataset.vid;
    var guoqi = e.currentTarget.dataset.guoqi;
    // console.log(id);
    var that = this;
    if (guoqi == 1) {
      wx.showToast({
        title: '优惠劵已过期'
      })
    } else {
      wx.request({
        url: con.Index_lingqu_youhui,
        method: 'POST',
        data: {
          wxappid: con.wyy_user_wxappid,
          fansid: app.globalData.fansid,
          id: id,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (r) {
          var data = r.data.info;
          if (data == 'success') {
            wx.showToast({
              title: '领取成功'
            })
          } else {
            wx.showToast({
              title: '不能重复领取'
            })
          }
        }
      })
    }

  },

  toDate: function (time) {
    var n = time * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },


  onShareAppMessage: function () {

  }

});