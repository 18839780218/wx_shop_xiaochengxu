// import ApiList from  '../../config/api';
// import request from '../../utils/request.js';
//获取应用实例
var app = getApp();
var con = require('../../data.js')
Page({
    data: {
        // types: null,
        typeTree: {}, // 数据缓存
        currType: 0,
        // 当前类型
        "types": [
        ],
        nowIndex: 0,
        typeTree: [],
        myHidden: false
    },

    onLoad: function (option){
        var that = this;
        wx.request({
            url: con.Index_getcategory,
            method:'GET',
            data: { wxappid:con.wyy_user_wxappid },
            header: {
                'Content-Type':  'application/json'
            },
            success: function (res) {
                //--init data
                var status = res.data.status;
                if(status==1) {
                    var list = res.data.info;
                    var catList = res.data.first;
                    console.log(res, catList);
                    that.setData({
                        types:list,
                        typeTree:list[that.data.nowIndex],
                        currType: list[0].id,
                        myHidden: true
                    });
                } else {
                    wx.showToast({
                        title:res.data.err,
                        duration:2000,
                    });
                }
                // console.log(list. currType)

            },
            error:function(e){
                wx.showToast({
                    title:'网络异常!',
                    duration:2000,
                });
            },

        });
    },

    tapType: function (e){
        var that = this;
        // const currType = e.currentTarget.dataset.typeId;
        var index = e.currentTarget.dataset.index; console.log(index);
        that.setData({
            nowIndex: index,
            typeTree: that.data.types[index]
        })
        // console.log(currType);
        // wx.request({
        //     url: con.Index_getgoodsbycateid,
        //     method:'GET',
        //     data: { wxappid: con.wyy_user_wxappid,cateid:currType},
        //     header: {
        //         'Content-Type':  'application/json'
        //     },
        //     success: function (res) {
        //         var status = res.data.status;
        //         if(status==1) {
        //             var catList = res.data.info;
        //             // console.log(catList);
        //             that.setData({
        //                 typeTree:catList,
        //             });
        //         } else {
        //             wx.showToast({
        //                 title:res.data.err,
        //                 duration:2000,
        //             });
        //         }
        //     },
        //     error:function(e){
        //         wx.showToast({
        //             title:'网络异常！',
        //             duration:2000,
        //         });
        //     }
        // });
    }
})