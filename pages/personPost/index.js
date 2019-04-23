import {httpRequest} from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  onDetail: (e) => {
    // 从子组件传来的数据，存在detail中
    const { item } = e.detail;
    wx.navigateTo({
      url: `/pages/post/post?data=${JSON.stringify(item)}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type } = options;
    wx.setNavigationBarTitle({
      title: type === 'star' ? '我的收藏' : '我的发布'
    })
    httpRequest({
      url: `users/post/${type}`,
    }).then(res => {
      this.setData({
        list: res.data.list
      })
    })
  },

});