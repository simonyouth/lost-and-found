// 封装wx.request成Promise
export const httpRequest = function (option) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...option,
      success: resolve,
      fail: reject,
    })
  })
}