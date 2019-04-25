import { handleUserInfo } from '../../utils/util';
import {httpRequest} from "../../utils/request";
import cloneDeep from 'lodash.clonedeep';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    letterList: {}, // 所有数据
    list: [], // 每组会话的最后一条数据
  },

  onGotUserInfo(e) {
    if (!app.globalData.userInfo) {
      const userInfo = handleUserInfo(e, app);
      if (userInfo) {
        app.globalData.userInfo = userInfo;
        this.setData({
          userInfo,
        })
      }
    }
  },

  /**
   * 分类
   * @param letters {Array}
   * @return { A: {}, B: {}}
   */
  listLetters(letters) {
    const current = app.globalData.id;
    const result = {};
    for (const item of letters) {
      const { creator, receiver } = item;
      let temp = creator;
      if (creator['_id'] === current) {
        temp = receiver;
      }
      if (!result.hasOwnProperty(temp['_id'])) {
        result[temp['_id']] = [];
      }
      result[temp['_id']].push(item);
    }
    return result;
  },

  // 取每组最后私信
  lastLetter(list) {
    const lastList = [];
    for (const key in list) {
      if (list.hasOwnProperty(key)) {
        const arr = list[key];
        const newest = arr[arr.length - 1];
        lastList.push({
          content: newest.type === 'text' ? newest.content: '[图片]',
          createTime: newest.createTime.split('T')[0],
          friend: newest.creator._id === app.globalData.id
            ? newest.receiver
            : newest.creator,
        });
      }
    }
    return lastList;
  },
  // 获取私信
  getLetter() {
    httpRequest({
      url: 'letter/all',
    }).then(res => {
      const { list: data } = res.data;
      const list = this.listLetters(data);
      // 取每组数据的最后一条
      const lastList = this.lastLetter(list);

      this.setData({
        letterList: list,
        list: lastList,
      })
    })
  },

  changeStatus(data) {
    httpRequest({
      url: 'letter/changestatus',
      data,
      method: 'PUT'
    }).then(() => {
      app.getUnreadCount();
      this.getLetter();
    })
  },

  handleMark(e) {
    const { action, friend } = e.currentTarget.dataset;
    let data = {};
    if (friend) {
      // 长按
      wx.showActionSheet({
        // TODO 删除本条
        itemList: ['标为已读'],
        success: (res) => {
          // console.log(res.tapIndex);
          this.changeStatus({ type: 'read', receiver: friend._id})
        }
      })
    } else {
      // 全部标为已读
      this.changeStatus({ type: action })
    }
  },
  listenSocket() {
      // ws监听
      app.globalData.localSocket.onMessage((msg) => {
        const data = JSON.parse(msg.data);
        const { creator } = data;
        // 接收ws发送的私信消息
        const { letterList, list } = this.data;
        const nextLetterList = cloneDeep(letterList);
        const nextList = cloneDeep(list);
        let hasNewChat = false; // 消息是否为新的会话
        if (!letterList.hasOwnProperty(creator._id)) {
          // 新对话
          nextLetterList[creator._id] = [];
          hasNewChat = true;
        }
        nextLetterList[creator._id].push(data);
        // 老新会话
        if (!hasNewChat) {
          const index = nextList.findIndex(v => v.friend._id === creator._id);
          nextList.splice(index, 1); // 删除旧的
        }
        // 添加到
        nextList.unshift({
          content: data.type === 'image' ? '[图片]' : data.content,
          createTime: data.createTime,
          friend: creator,
        });
        this.setData({
          letterList: nextLetterList,
          list: nextList,
        });
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息'
    });
    this.setData({
      userInfo: app.globalData.userInfo
    });
    // 私信
    this.getLetter();
  },

  onShow() {
    // 登录用户
    if (app.globalData.id) {
      this.listenSocket();
    }
  },
  onTap(e) {
    const { friend } = e.currentTarget.dataset;
    const { letterList } = this.data;
    wx.navigateTo({
      url: `/pages/letterDetail/index?receiver=${JSON.stringify(friend)}&data=${JSON.stringify(letterList[friend._id])}`
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getLetter();
  },

});
