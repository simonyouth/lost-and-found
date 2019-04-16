import QQMapWX from './qqmap-wx-jssdk.min.js';
import { decodeUserInfo } from './request';
const OK = 'getUserInfo:ok';

export const qqmap = new QQMapWX({
  key: 'Q7MBZ-6LXWJ-FBQFV-KBKBX-WW4N2-OJBEM'
});

export const handleUserInfo = (e, app) => {
  if (e.detail.errMsg === OK) {
    const { encryptedData, iv, userInfo } = e.detail;
    decodeUserInfo({
      encryptedData,
      iv,
    }, app);

    return userInfo;
  }
  wx.showToast({
    title: '授权失败，请到‘个人中心-设置’里打开相关权限',
    icon: 'none'
  });
  return false;
};