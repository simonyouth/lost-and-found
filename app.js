import { httpRequest, initWs } from './utils/request.js';

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code) {
         httpRequest({
            url: `users/login`,
            data: {
              code: res.code
            },
          }).then(alldata => {
            const sessionID = alldata.header['set-cookie'];
            // 本地存储cookies
           if (sessionID) {
             wx.setStorageSync('sessionId', sessionID);
           }
           const { userinfo } = alldata.data;
           if (userinfo) {
             // 老用户，保存id，创建ws连接
             this.globalData.id = userinfo._id;
             this.globalData.userInfo = {
               nickName: userinfo.nickName,
               avatarUrl: userinfo.avatarUrl,
             };
             // 获取未读消息
             this.getUnreadCount();
             // ws连接
             this.globalData.localSocket = initWs(userinfo._id);
             this.globalData.localSocket.onMessage((data) => {
               this.getUnreadCount();
             })
           }
          })
        }
      }
    })
  },

  getUnreadCount() {
    httpRequest({
      url: 'letter/unread',
    }).then(res => {
      if (res.data.count) {
        wx.setTabBarBadge({
          index: 1,
          text: res.data.count+ '',
        })
      } else {
        wx.removeTabBarBadge({
          index: 1,
        })
      }
    })
  },
  onShow() {
    if ( this.globalData.id && this.globalData.localSocket.readyState !== 0
      &&  this.globalData.localSocket.readyState !== 1) {
      console.log('重连ws');
      this.globalData.localSocket = initWs(this.globalData.id);
    }
  },
  onHide() {
    this.globalData.localSocket && this.globalData.localSocket.close();
  },
  globalData: {
    userInfo: null,
    id: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
  }
});
