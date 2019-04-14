import QQMapWX from './qqmap-wx-jssdk.min.js';
import { decodeUserInfo } from './request';
const OK = 'getUserInfo:ok';

export const qqmap = new QQMapWX({
  key: 'Q7MBZ-6LXWJ-FBQFV-KBKBX-WW4N2-OJBEM'
});

export const handleUserInfo = (e, cb) => {
  if (e.detail.errMsg === OK) {
    const { encryptedData, iv, userInfo } = e.detail;
    decodeUserInfo({
      encryptedData,
      iv,
    }, cb);
    return userInfo;
  }
  console.log(e);
  wx.showToast({
    title: '授权失败，请到‘个人中心-设置’里打开相关权限',
    icon: 'none'
  });
  return false;
};