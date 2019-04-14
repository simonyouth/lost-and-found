import { settingList } from '../../utils/store';
import { decodeUserInfo } from '../../utils/request';
import { handleUserInfo } from '../../utils/util';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    settingList: settingList,
  },

  handleItem(e) {
    const { key } = e.detail;
    if (key === 'setting') {
      wx.openSetting({
        success: (res) => {
          console.log(res)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    });
    if (app.globalData) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
  },
  onGotUserInfo(e) {
    const userInfo = handleUserInfo(e);
    app.globalData.userInfo = userInfo;
    this.setData({
      userInfo,
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
