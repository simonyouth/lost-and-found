// 封装wx.request成Promise
import { base, imgUrl } from "./config";

export const httpRequest = function (option) {
  try {
    // 给每个请求种 cookie
    const sessonId = wx.getStorageSync('sessionId');
    if (sessonId) {
      option.header = option.header || {};
      option.header['Cookie'] = sessonId;
    }
    // POST请求添加content-type
    if (option.method === 'POST') {
      option.header = option.header || {};
      option.header['content-type'] = 'application/x-www-form-urlencoded';
    }
    return new Promise((resolve, reject) => {
      wx.request({
        ...option,
        url: option.noBase ? option.url : `${base}${option.url}`,
        success: resolve,
        fail: reject,
      })
    })
  } catch (e) {
    console.error(e)
  }
};

// button 点击登录后 发送请求到服务端，获取userinfo
export const decodeUserInfo = function (params, app, cb) {
  if (!app.globalData.id) {
    // 新用户，解密数据
    httpRequest({
      url: `users/decodeUserInfo`,
      data: params,
      method: 'POST',
    }).then(({data}) => {
      app.globalData.id = data.id;
      // 新用户登录后创建ws连接
      app.globalData.localSocket = initWs(data.id);
      cb && cb(data)
    });
  }
};

export function uploadImg(file) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: imgUrl,
      filePath: file,
      name: 'file',
      formData: null,
      success: (res) => resolve(res),
      fail: (err) => reject(err),
    })
  })
}

// WebSocket连接
// ws.readyState 0:CONNECTING 1:OPEN 2:CLOSING 3:Closed
export function initWs(id) {
  const ws = wx.connectSocket({
    url: `ws://127.0.0.1:8081`,
  });
  ws.onOpen(res => {
    wx.sendSocketMessage({
      data: JSON.stringify({ msg: '这是测试的哦', id}),
    })
  });

  ws.onClose(res => {
    console.error('...end.........')
  });
  return ws;
}