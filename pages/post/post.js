import { type } from '../../utils/store';
import { handleUserInfo } from '../../utils/util';
import {httpRequest} from "../../utils/request";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: Object,
    type: type,
    id: app.globalData.id,
    hidden: true, // modal管理窗
  },
  onBroadcast() {
    const { type, _id } = this.data.data;
    wx.navigateTo({
      url: `/pages/broadcast/broadcast?type=${type}&id=${_id}`,
    })
  },
  toLetter(e) {
    if (app.globalData.userInfo) {
      app.globalData.userInfo = handleUserInfo(e, app, (res) => {
        this.setData({
          id: res.id,
        });
        wx.navigateTo({
          url: `/pages/letterDetail/index`
        })
      });
    }
    console.log(this.data.data)
    const { creator } = this.data.data;
    wx.navigateTo({
      url: `/pages/letterDetail/index?receiver=${JSON.stringify(creator)}`
    })
  },
  setHidden() {
    this.setData({ hidden: !this.data.hidden })
  },
  handleUpdate(e) {
    const { type: action } = e.currentTarget.dataset;
    const { _id, type } = this.data.data;
    httpRequest({
      url: `${type}/post/manage`,
      data: {
        type: action,
        id: _id
      },
      method: 'PUT'
    });
    this.setHidden();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    const { data } = options;
    this.setData({
      data: JSON.parse(data),
      id: app.globalData.id
    });
    console.log(JSON.parse(data))
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});