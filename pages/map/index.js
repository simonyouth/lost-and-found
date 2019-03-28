import { qqmap } from '../../utils/util.js';
Page({
  data: {
    longitude: 113.3241,
    latitude: 23.423,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap');
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  /**
   * 监听页面显示
   */
  onShow: function () {
    wx.getLocation({
      success: (res) => {
        console.log(res)
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        })
      },
    })
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