import { qqmap } from '../../utils/util.js';
import cloneDeep from 'lodash.clonedeep';
const test = new Array(20);
Page({
  data: {
    longitude: Number,
    latitude: Number,
    markers: [{
      iconPath: './images/center.png',
      id: 1,
      latitude: Number,
      longitude: Number,
      width: 40,
      height: 40,
    }, {
      iconPath: './images/poi.png',
      id: 2,
      latitude: Number,
      longitude: Number,
      width: 40,
      height: 40,
    }],
    suggestions: test.fill({name: '河南1111'}),
  },

  /**
   * 生命周期函数--监听页面加载, 接受页面跳转传递的参数
   */
  onLoad: function (options) {
   wx.setNavigationBarTitle({
     title: '定位查找'
   });
   // 设置标题栏style
    wx.setNavigationBarColor({
      backgroundColor: '#fff',
      frontColor: '#000000'
    });
  },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap');
  },
  getCenterLocation: function () {
    const markers = cloneDeep(this.data.markers);
    this.mapCtx.getCenterLocation({
      success: (res) => {
        markers[0].latitude = res.latitude;
        markers[0].longitude = res.longitude;
        this.setData({
          markers,
        })
      }
    })
  },
  searchByKeywords: (word) => {
    qqmap.search({
      keyword: word,
      success: (res) => {
        console.log(res)
      },
    })
  },
  touchMap: function(res){
    console.log(res)
  },
  handleRegion: function(e) {
    if (e.type === 'end' && (e.causedBy === 'drag' || e.causedBy === 'scale')) {
      this.getCenterLocation();
    }
  },
  poitap: function(res) {
    console.log(res);
    const { latitude, longitude } = res.detail;
    const markers = cloneDeep(this.data.markers);
    markers[1].longitude = longitude;
    markers[1].latitude = latitude;
    this.setData({
      markers,
      suggestions: [res],
    })
  },
  // 当前位置
  getCurrentLocation: () => {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        })
      }
    });
  },
  // 移到中心点
  moveToLocation: () => {
    this.mapCtx.moveToLocation();
  },
  /**
   * 监听页面显示
   */
  onShow: function () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
