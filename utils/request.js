// 封装wx.request成Promise
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
