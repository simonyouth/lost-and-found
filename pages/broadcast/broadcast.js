import { httpRequest } from '../../utils/request';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    content: String,
    id: '',
    type: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加留言'
    });
    this.setData({
      id: options.id,
      type: options.type,
      userInfo: app.globalData.userInfo
    });
    console.log(options)
  },

  input(e) {
    const { value } = e.detail;
    this.setData({
      content: value,
    });
  },
  commit() {
    const { type, id, content } = this.data;
    // 提交添加留言请求
    httpRequest({
      url: `${type}/post/add/msg`,
      data: {
        id,
        content,
      },
      method: 'POST'
    }).then((res) => {
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        complete: () => {
          // 返回上级页面，更新留言列表
          const pages = getCurrentPages();
          const prev = pages[pages.length - 2];
          const list = { ...prev.data.data };
          list.msgList = res.data.list.msgList;
          prev.setData({
            data: list,
          });
          wx.navigateBack();
        }
      });

    })
  },
})