import { httpRequest, uploadImg } from '../../utils/request';
const app = getApp();

Page({
  data: {
    scrollHeight: 'calc(100% - 100rpx)',
    scrollTop: Number,
    list: [],
    message: String,
    receiver: '',
  },

  // 发送图片，本地相册或者拍摄上传
  showPic() {
    const { tempImagePath } = this.data;
    const paths = tempImagePath.slice();
    wx.chooseImage({
      success: res => {
        console.log(res);
        paths.push(res.tempFilePaths);
        const arr = res.tempFilePaths.map(path => uploadImg(path));
        Promise.all(arr)
          .then(urls => {
            console.log(urls);
            const message = urls.map(v => JSON.parse(v.data).data);
            console.log(message);
            this.send({ imgUrls: message, type: 'image' });
          });

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
  send(options = {}) {
    const { imgUrls, type } = options;
    const { message, receiver } = this.data;
    if (imgUrls || message) {
      // 发送消息
      httpRequest({
        url: 'letter/send',
        data: {
          content: imgUrls || message,
          type: type || 'text',
          receiver,
        },
        method: 'POST'
      }).then(res => {
        if (res.data.success) {
          // 请求数据，实时回显
          this.getMessage();
        }
      }).catch(e => { console.log(e)})
    }
  },

  getMessage(options) {
    const { receiver } = this.data;
    httpRequest({
      url: 'letter/all',
      data: {
        receiver,
      }
    }).then(res => {
      console.log(res)
      const { list } = res.data;
      this.setData({
        list,
        message: '',
        scrollTop: list.length * 100,
      })
    })
  },

  previewImage(e) {
    const { url } = e.currentTarget.dataset;

    //遍历list，获取所有的图片消息，非功能性需求分析
    const { list } = this.data;
    const imgList = list.filter(v => v.type === 'image');
    const urls = [];
    imgList.forEach(v => urls.push(...v.content));

    wx.previewImage({
      urls: urls,
      current: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { data, receiver } = options;
    receiver = JSON.parse(options.receiver);
    const {  _id, nickName } = receiver;

    if (data) {
      data = JSON.parse(options.data);
      this.setData({
        list: data,
        scrollTop: data.length * 100,
      })
    }

    this.setData({
      receiver: _id,
    }, () => {
      !data ? this.getMessage() : '';
    });

    wx.setNavigationBarTitle({
      title: nickName,
    });

    // ws监听
    app.globalData.localSocket.onMessage(data => {
      this.getMessage()
    })
  },
});