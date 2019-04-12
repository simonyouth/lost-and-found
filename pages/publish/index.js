import { formList } from './constant';
import { type } from '../../utils/store';
const type2Word = { lost: '失物贴', found: '寻物贴' };
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formList: formList,
    sortType: type,
    isLost: false, // 是否是失物招领
    picList: [], // 图片列表
  },

  toMap() {
    wx.chooseLocation({
        success:res=>{
          this.setData({
            address: res.address,
          })
        }
    })
  },
  pickerChange(e) {
    this.setData({
      index:e.detail.value
    })
  },

  uploadPicture() {
    wx.chooseImage({
      success: res => {
        this.setData({
          picList: res.tempFilePaths,
        })

      }
    });
  },
  formSubmit(e) {
    const { value } = e.detail;
    // TODO POST请求，发布贴子
  },
  formReset() {
    // 重置
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type } = options;
    wx.setNavigationBarTitle({
      title: `发布${type2Word[type]}`
    });
    this.setData({
      isLost: type === 'lost'
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