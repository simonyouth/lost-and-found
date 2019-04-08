// 封装wx.request成Promise
import base from "./config";

export const httpRequest = function (option) {
  try {
    // 给每个请求种 cookie
    const sessonId = wx.getStorageSync('sessionId');
    if (sessonId) {
      option.header = option.header || {};
      option.header['Cookie'] = sessonId;
    }
    return new Promise((resolve, reject) => {
      wx.request({
        ...option,
        success: resolve,
        fail: reject,
      })
    })
  } catch (e) {
    console.error(e)
  }
};

// button 点击登录后 发送请求到服务端，获取userinfo
export const decodeUserInfo = function (params, cb) {
  httpRequest({
    url: `${base}/users/decodeUserInfo`,
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'POST',
  }).then(docinfo => {
    if (cb) {
      cb(docinfo)
    }
  });
};
