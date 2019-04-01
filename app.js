import base from './utils/config.js';
import { httpRequest } from './utils/request.js';

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code) {
         httpRequest({
            url: `${base}/users/login`,
            data: {
              code: res.code
            },
          }).then(alldata => {
            const sessionID = alldata.header['set-cookie'];
            // 本地存储cookies
            wx.setStorageSync('sessionId', sessionID);
            // 发送用户信息
            wx.getSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      const params = {
                        encrytedData: res.encryptedData,
                        iv: res.iv,
                      };
                      httpRequest({
                        url: `${base}/users/decodeUserInfo`,
                        data: params,
                        header: {
                          "content-type": "application/x-www-form-urlencoded",
                          // "Cookie": sessionID,
                        },
                        method: 'POST',
                      }).then(docinfo => {
                        
                      });
                      // 可以将 res 发送给后台解码出 unionId
                      this.globalData.userInfo = res.userInfo
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res)
                      }
                    }
                  })
                }
              }
            });
          
          })
        }
      }
    })
    // 获取用户信息
  },
  globalData: {
    userInfo: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
  }
});
