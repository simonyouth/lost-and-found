import { handleUserInfo } from '../../utils/util';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    letterList: [1,2,3]
  },

  onGotUserInfo(e) {
    if (!app.globalData.userInfo) {
      const userInfo = handleUserInfo(e, (res) => {
        app.globalData.id = res.data.id;
      });
      if (userInfo) {
        app.globalData.userInfo = userInfo;
        this.setData({
          userInfo,
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息'
    });
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onTap(e) {
    wx.navigateTo({
      url: '/pages/letterDetail/index'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
