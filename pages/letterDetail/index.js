import { httpRequest, uploadImg } from '../../utils/request';
import cloneDeep from 'lodash.clonedeep';
const app = getApp();

Page({
  data: {
    scrollHeight: 'calc(100% - 100rpx)',
    scrollTop: Number,
    list: [],
    message: String,
    receiver: '',
    currentId: app.globalData.id,
  },

  // 发送图片，本地相册或者拍摄上传
  showPic() {
    wx.chooseImage({
      success: res => {
        const arr = res.tempFilePaths.map(path => uploadImg(path));
        Promise.all(arr)
          .then(urls => {
            const message = urls.map(v => JSON.parse(v.data).data);
            this.send({ imgUrls: message, msgType: 'image' });
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
    const { imgUrls, msgType } = options;
    const { message, receiver } = this.data;

    if (imgUrls || message) {
      httpRequest({
        url: 'letter/send',
        data: {
          content: imgUrls || message,
          type: msgType || 'text',
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

  // 获取私信
  getMessage(options) {
    const { receiver } = this.data;
    httpRequest({
      url: 'letter/all',
      data: {
        receiver,
      }
    }).then(res => {
      // 成功
      const { list } = res.data;
      // 清空输入框
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

  // 标为已读
  hasRead() {
    const { receiver } = this.data;
    httpRequest({
      url: 'letter/changestatus',
      method: 'PUT',
      data: {
        receiver,
        type: 'read'
      }
    }).then(res => {
      app.getUnreadCount()
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
      currentId: app.globalData.id,
    }, () => {
      !data ? this.getMessage() : '';
      this.hasRead();
    });

    wx.setNavigationBarTitle({
      title: nickName,
    });

    // ws监听
    app.globalData.localSocket.onMessage(msg => {
      const data = JSON.parse(msg.data);
      const { creator } = data;
      const { receiver, list } = this.data;
      if (creator._id === receiver) {
        const temp = cloneDeep(list);
        // JSON.stringify会将所有都toString()，导致数组变成了string
        temp.push({
          ...data,
          content: data.type === 'image' ? data.content.split(',') : data.content,
        });
        this.setData({
          list: temp,
          scrollTop: temp.length * 100,
        })
      }
    })
  },
});