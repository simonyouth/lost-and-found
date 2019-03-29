import QQMapWX from './qqmap-wx-jssdk.min.js';

export const qqmap = new QQMapWX({
  key: 'Q7MBZ-6LXWJ-FBQFV-KBKBX-WW4N2-OJBEM'
});

// 封装wx.request成Promise
export const httpRequest = function(option) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...option,
      success: function (res) { 
        resolve(res);
      },
      fail: function (res) {
        reject(res);
      },
    })
  })
}