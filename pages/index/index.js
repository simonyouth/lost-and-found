import { testList, testList2, defaultCityLocation } from '../../utils/store.js';
import { qqmap } from '../../utils/util.js';
const app = getApp()

Page({
  data: {
    activeIndex: 1,
    list: testList,
    foundList: testList2,
    customLocation: Object, // 选择的位置
    city: String,
  },
  //事件处理函数
  changeSorter: function(e) {
    const { dataset: { activeIndex }} = e.target;
    this.setData({
      activeIndex: Number(activeIndex),
    });
    // TODO 请求数据
  },
  onDetail: (e) => {
    // 从子组件传来的数据，存在detail中
    const { id } = e.detail;
    console.log('点击！！', id);
    wx.navigateTo({
      url: `/pages/post/post?id=${id}`,
    })
  },
  // 跳转到map
  navigateToMap() {
    // 自定义的地图
    // wx.navigateTo({
    //   url: '../map/index',
    // })

    // 小程序自带地图
    wx.chooseLocation({
        success: res => {
          console.log(res)
          this.setData({
            customLocation: res,
          })
        }
    });
  },

  // 搜索confirm
  handleSearch(e) {
    const { value } = e.detail;
    console.log(value)
  },
  // 地理位置逆转换
  reverseGeocoder(location) {
    return new Promise(resolve => {
      qqmap.reverseGeocoder({
        location,
        success: (addr) => {
          const { city } = addr.result.address_component;
          resolve(addr.result);
        },
      })
    });
  },

  onLoad: function () {
    this.setUserInfo();
    // 获取城市列表
    qqmap.getCityList({
      success: (res) => {
        // console.log('省份数据：', res.result[0]); //打印省份数据
        // console.log('城市数据：', res.result[1]); //打印城市数据
        // console.log('区县数据：', res.result[2]); //打印区县数据
      },
      fail: (e) => {
        console.log(e);
      },
    });
  },

  onShow() {
    let location = defaultCityLocation;
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        location = {
          latitude: res.latitude,
          longitude: res.longitude
        }
      },
      fail: () => {
        wx.showToast({
          title: '定位失败，请到‘个人中心-设置’里允许获取位置信息，默认北京市',
          icon: 'none'
        })
      },
      complete: (res) => {
        this.reverseGeocoder(location)
          .then(addr => {
            const { city } = addr.address_component;
            this.setData({
              city,
            })
          })
      }
    });
  },
  setUserInfo: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
