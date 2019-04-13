import { formList } from './constant';
import { type } from '../../utils/store';
import { httpRequest } from '../../utils/request';

const type2Word = { lost: '失物贴', found: '寻物贴' };
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formList: formList,
    sortType: type,
    routerType: 'found', // lost, found
    picList: [], // 图片列表
    formData: {},
    tip: '*', // 必填提示
  },

  toMap(e) {
    const { name } = e.target.dataset;
    wx.chooseLocation({
        success: res => {
          this.setData({
            address: res.address,
          });
          this.updateFormData(name, res.address)
        }
    })
  },
  pickerChange(e) {
    const { name } = e.target.dataset;
    const { value } = e.detail;
    this.setData({
      index: value
    });
    this.updateFormData(name, value)
  },

  updateFormData(key, value) {
    const { formData } = this.data;
    const data = { ...formData };
    data[key] = value;
    this.setData({
      formData: data,
    });
    console.log(data)
  },
  input(e) {
    const { value } = e.detail;
    const { name } = e.target.dataset;
    this.updateFormData(name, value)
  },
  uploadPicture() {
    wx.chooseImage({
      success: res => {
        // TODO 上传图片到服务器
        this.setData({
          picList: res.tempFilePaths,
        })

      }
    });
  },
  formSubmit(e) {
    const { value } = e.detail;
    // 判断空
    if (!value.title || !value.content
      || !value.location || !value.category) {
      this.setData({
        tip: '必填项不能为空！'
      })
    } else {
      const { routerType } = this.data;
      httpRequest({
        url: `${routerType}/publish`,
        method: 'POST',
        data: value,
      }).then(res => {
        if (res.success) {
          // TODO 跳转页面
        }
      })
    }
  },
  formReset() {
    // 重置
    this.setData({
      picList: [],
    })
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
      routerType: type
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