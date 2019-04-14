import QQMapWX from './qqmap-wx-jssdk.min.js';
import { decodeUserInfo } from './request';

export const qqmap = new QQMapWX({
  key: 'Q7MBZ-6LXWJ-FBQFV-KBKBX-WW4N2-OJBEM'
});

export const handleUserInfo = (e) => {
  console.log(e);
  const { encryptedData, iv, userInfo } = e.detail;
  decodeUserInfo({
    encryptedData,
    iv,
  });
  return userInfo;
};