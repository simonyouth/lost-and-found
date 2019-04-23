import { settingList } from '../../utils/store';
import {decodeUserInfo, httpRequest} from '../../utils/request';
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
  // 我发布的 我收藏的
  handleAbout(e) {
    console.log(e)
    const { type } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../personPost/index?type=${type}`
    });
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
    const userInfo = handleUserInfo(e, app);
    app.globalData.userInfo = userInfo;
    this.setData({
      userInfo,
    })
  },

});
