
var app = getApp();
var con = require('../../data.js');
var initSubMenuHighLight = [
  ['', '', '', '', ''],
  ['', ''],
  ['', '', '']
];
function initSubMenuDisplay() {
  return ['hidden', 'hidden', 'hidden'];
}
Page({
  data: {
    catid: '',
    productData:[],
    subMenuDisplay: initSubMenuDisplay(),
    subMenuHighLight: initSubMenuHighLight,
    resetIndex: [0, 0],
    zOrder: '',
    mPrice: '',
    hPrice: '',
    code: ''
  },

  onLoad: function (options) {
    var catid = options.catid;
    console.log(catid);
    this.setData({
      catid: catid
    })
    this.showList();
  },
  onShow: function () {
    
  },
  tapMainMenu: function (e) {
    //        获取当前显示的一级菜单标识
    var index = parseInt(e.currentTarget.dataset.index);
    // 生成数组，全为hidden的，只对当前的进行显示
    var newSubMenuDisplay = initSubMenuDisplay();
    //如果目前是显示则隐藏，反之亦反之。同时要隐藏其他的菜单
    if (this.data.subMenuDisplay[index] == 'hidden') {
      newSubMenuDisplay[index] = 'show';
    } else {
      newSubMenuDisplay[index] = 'hidden';
    }        // 设置为新的数组
    this.setData({
      subMenuDisplay: newSubMenuDisplay
    });
  },

  //获取当前显示的一级菜单标识
  tapSubMenu: function (e) {

    // 处理二级菜单，首先获取当前显示的二级菜单标识
    var indexArray = e.currentTarget.dataset.index.split('-');
    var numOrder = e.currentTarget.dataset.price; console.log(numOrder);
    if (indexArray[0] == 2) {
      var code = e.currentTarget.dataset.code; console.log(code);
      this.setData({
        code: code
      })
    }
    // 初始化状态
    // var newSubMenuHighLight = initSubMenuHighLight;
    for (var i = 0; i < initSubMenuHighLight.length; i++) {
      // 如果点中的是一级菜单，则先清空状态，即非高亮模式，然后再高亮点中的二级菜单；如果不是当前菜单，而不理会。经过这样处理就能保留其他菜单的高亮状态
      if (indexArray[0] == i) {
        for (var j = 0; j < initSubMenuHighLight[i].length; j++) {
          // 实现清空
          initSubMenuHighLight[i][j] = '';
        }
        // 将当前菜单的二级菜单设置回去
      }
    }
    // 与一级菜单不同，这里不需要判断当前状态，只需要点击就给class赋予highlight即可
    initSubMenuHighLight[indexArray[0]][indexArray[1]] = 'highlight';
    // 设置为新的数组
    this.setData({
      subMenuHighLight: initSubMenuHighLight,
      resetIndex: indexArray,
      zOrder: numOrder
    });
    if (numOrder == 'undefined') {
      this.setData({
        zOrder: ''
      });
    }
  },
  // 重置选项
  resetChoice: function() {
    console.log(1);
    var indexArray = this.data.resetIndex;
    initSubMenuHighLight[indexArray[0]][indexArray[1]] = '';
    this.setData({
      subMenuHighLight: initSubMenuHighLight,
    });
    
  },
  // 获取价格区间
  formSubmit: function(e) {
    var val1 = e.detail.value.mPrice;
    var val2 = e.detail.value.hPrice;
    console.log(val1, val2);
    if (this.data.zOrder != undefined) {
      this.setData({
        mPrice: '',
        hPrice: '',
      })
    } else {
      this.setData({
        mPrice: val1,
        hPrice: val2,
      })
    }
    var indexArray = this.data.resetIndex;
    initSubMenuHighLight[indexArray[0]][indexArray[1]] = '';
    this.setData({
      subMenuHighLight: initSubMenuHighLight,
    });
  },
  // 获取价格
  // 输入的内容
  message: function (e) {
    var val = e.detail.value;
    
  },
  confirmFun: function() {
    // 隐藏所有一级菜单
    this.showList();
    this.setData({
      subMenuDisplay: initSubMenuDisplay()
    });
  },
  // 数据
  showList: function(){
   var that = this;
   var zz = that.data.zOrder
   console.log(110, that.data.zOrder);
   if (that.data.zOrder == undefined ) {
     zz = ''
   }
   wx.request({
     url: con.Index_getgoodsbycateid,
     method: 'GET',
     data: { 
       wxappid: con.wyy_user_wxappid, 
       cateid: that.data.catid ,
       term: zz,
       mPrice: that.data.mPrice,
       hPrice: that.data.hPrice,
       value: that.data.code
       },
     header: {
       'Content-Type': 'application/json'
     },
     success: function (res) {
       var status = res.data.status;
       if (res.data.info == false) {
         wx.showToast({
           title: '没有符合条件的商品'
         });
       }
       if (status == 1) {
         var catList = res.data.info;
         console.log(res);
         that.setData({
           productData: catList
         });
       } else {
         wx.showToast({
           title: res.data.err,
           duration: 2000,
         });
       }
       that.setData({
         term: '',
         mPrice: '',
         hPrice: '',
         code: ''
       })
     },
     error: function (e) {
       wx.showToast({
         title: '网络异常！',
         duration: 2000,
       });
     }
   });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})