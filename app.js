import base from './utils/config.js';
import { httpRequest } from './utils/request.js';

App({
  onLaunch: function () {
    wx.setTabBarBadge({
      index: 1,
      text: '123',
    });
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
