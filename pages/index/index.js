import { defaultCityLocation } from '../../utils/store.js';
import { qqmap } from '../../utils/util.js';
import { httpRequest } from '../../utils/request';
import { handleUserInfo } from '../../utils/util';
const app = getApp();

Page({
  data: {
    activeIndex: 1,
    lostList: [],
    foundList: [],
    city: String,
    timeDesc: true, // 默认时间降序
    keyWords: '',
    pageNumLost: 0,
    pageNumFound: 0,
    lostTotal: 0, // 贴子总数
    foundTotal: 0,
  },
  //事件处理函数
  changeSorter: function(e) {
    const { dataset: { activeIndex }} = e.target;
    this.setData({
      activeIndex: Number(activeIndex),
    }, () => {
      const { lostList, foundList } = this.data;
      if ((activeIndex == 1 && lostList.length === 0)
        || (activeIndex == 2 && foundList.length === 0)) {
        this.search()
      }

    });
  },
  onDetail: (e) => {
    // 从子组件传来的数据，存在detail中
    const { item } = e.detail;
    wx.navigateTo({
      url: `/pages/post/post?data=${JSON.stringify(item)}`,
    })
  },
  // 时间排序
  handleTime() {
    this.setData({
      timeDesc: !this.data.timeDesc,
      pageNumFound: 0,
      pageNumLost: 0,
    }, () => {
      this.search({ clear: true })
    })
  },
  toPublish(e) {
    if (!app.globalData.userInfo) {
      const info = handleUserInfo(e, app);
      if (info) {
        app.globalData.userInfo = info;
        wx.navigateTo({
          url: '../publishType/index'
        })
      }
    } else {
      wx.navigateTo({
        url: '../publishType/index'
      })
    }
  },
  // 跳转到map
  navigateToMap() {
    // 小程序自带地图
    wx.chooseLocation({
        success: res => {
          this.reverseGeocoder(res).then(s => {
            this.setData({
              city: s.address_component.city,
            }, () => {
              this.search({ clear: true })
            })
          })
        }
    });
  },

  // 搜索confirm
  handleSearch(e) {
    const { value } = e.detail;
    this.setData({
      keyWords: value,
      lostList: [],
      foundList: [],
      pageNumFound: 0,
      pageNumLost: 0,
    }, () => {
      this.search({ clear: true });
    });
  },
  // 地理位置逆转换
  reverseGeocoder(location) {
    return new Promise(resolve => {
      qqmap.reverseGeocoder({
        location,
        success: (addr) => {
          // const { city } = addr.result.address_component;
          resolve(addr.result);
        },
      })
    });
  },

  search(options = {}) {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    const { clear } = options;
    const {
      activeIndex,
      timeDesc,
      keyWords,
      city,
      pageNumLost,
      pageNumFound,
    } = this.data;
    httpRequest({
      url: `${activeIndex == 1 ? 'lost' : 'found'}/list`,
      data: {
        location: city,
        keyWords,
        timeOrder: timeDesc ? -1 : 1,
        pageNum: activeIndex == 1 ? pageNumLost : pageNumFound,
      }
    }).then(res => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();

      const { list, total } = res.data;
      const { lostList, foundList } = this.data;

      if (activeIndex == 1) {
        let tempLost = clear ? list : [...lostList, ...list];
        this.setData({
          lostList: tempLost,
          lostTotal: total,
        })
      } else {
        let tempFound = clear ? list : [...foundList, ...list];
        this.setData({
          foundList: tempFound,
          foundTotal: total,
        })
      }
    })
  },

  onPullDownRefresh() {
    this.search({ clear: true })
  },
  onReachBottom() {
    const { lostTotal, foundTotal, foundList, lostList, activeIndex } = this.data;
    if (activeIndex == 1 && lostTotal > lostList.length) {
      this.setData({
        pageNumLost: this.data.pageNumLost + 1
      }, () => {
        console.log(this.data.pageNumLost)
        this.search()
      });
    } else if (activeIndex == 2 && foundTotal > foundList.length) {
      this.setData({
        pageNumFound: this.data.pageNumFound + 1
      }, () => {
        console.log(this.data.pageNumFound)
        this.search()
      });
    }
  },
  onLoad: function () {
    this.getLocation();
  },

  getLocation() {
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
            }, () => {
              // 获取贴子列表
              this.search({ clear: true })
            });
          })
      }
    });
  },
  setUserInfo: function () {
    if (app.globalData.userInfo) {

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
})
