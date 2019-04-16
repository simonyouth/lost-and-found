Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 'calc(100% - 100rpx)',
    test: [1,2,3,4,5,6,7],
    tempImagePath: [],
    message: String,
  },

  // 发送图片，本地相册或者拍摄上传
  showPic() {
    const { tempImagePath } = this.data;
    const paths = tempImagePath.slice();
    wx.chooseImage({
      success: res => {
        console.log(res);
        paths.push(res.tempFilePaths);
        this.setData({
          tempImagePath: paths,
        })
      }
    });
  },
  // textarea失去焦点
  loseBlur() {
    // 计算send高度
    const query = wx.createSelectorQuery();
    query.select('.send').boundingClientRect(rect => {
      this.setData({
        scrollHeight: `calc(100% - ${rect.height}px)`
      })
    }).exec();
  },

  handleInput(e) {
    const { value } = e.detail;
    this.setData({
      message: value,
    })
  },
  send() {
    const { message } = this.data;
    if (message) {
      // TODO 发送消息，使用websocket，目标用户ID
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'biu',
    })
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