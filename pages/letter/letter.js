import { handleUserInfo } from '../../utils/util';
import {httpRequest} from "../../utils/request";
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    letterList: [],
    list: [],
  },

  onGotUserInfo(e) {
    if (!app.globalData.userInfo) {
      const userInfo = handleUserInfo(e, app);
      if (userInfo) {
        app.globalData.userInfo = userInfo;
        this.setData({
          userInfo,
        })
      }
    }
  },

  /**
   * 分类
   * @param letters {Array}
   * @return { A: {}, B: {}}
   */
  listLetters(letters) {
    const current = app.globalData.id;
    const result = {};
    for (const item of letters) {
      const { creator, receiver } = item;
      let temp = creator;
      if (creator['_id'] === current) {
        temp = receiver;
      }
      if (!result.hasOwnProperty(temp['_id'])) {
        result[temp['_id']] = [];
      }
      result[temp['_id']].push(item);
    }
    return result;
  },

  // 获取私信
  getLetter() {
    httpRequest({
      url: 'letter/all',
    }).then(res => {
      const { list: data } = res.data;
      const list = this.listLetters(data);
      // 取每组数据的最后一条
      const lastList = [];
      for (const key in list) {
        if (list.hasOwnProperty(key)) {
          const arr = list[key];
          const newest = arr[arr.length - 1];
          lastList.push({
            content: newest.type === 'text' ? newest.content: '[图片]',
            createTime: newest.createTime.split('T')[0],
            friend: newest.creator._id === app.globalData.id
              ? newest.receiver
              : newest.creator,
          });
        }
      }
      this.setData({
        letterList: list,
        list: lastList,
      })
    })
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
    });
    this.getLetter();
  },
  onTap(e) {
    const { friend } = e.currentTarget.dataset;
    const { letterList } = this.data;
    wx.navigateTo({
      url: `/pages/letterDetail/index?receiver=${JSON.stringify(friend)}&data=${JSON.stringify(letterList[friend._id])}`
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
