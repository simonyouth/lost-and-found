import { qqmap } from '../../utils/util.js';
import cloneDeep from 'lodash.clonedeep';
let test = new Array(20);
test.fill(1)
test = test.map((v, i) => ({
  name: `测试数据${i}`,
  id: i,
}));
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
    suggestions: test,
    selected: String,
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
    this.mapCtx.getCenterLocation({
      success: (res) => {
        this.setMarkers(res, 1)
      }
    })
  },
  // 更新标记
  setMarkers(location, index) {
    const markers = cloneDeep(this.data.markers);
    markers[index].latitude = location.latitude;
    markers[index].longitude = location.longitude;
    this.setData({
      markers,
    })
  },

  searchByKeywords(e) {
    const { value } = e.detail;
    qqmap.search({
      keyword: value,
      success: (res) => {
        this.setData({
          suggestions: res.data,
          selected: res.data[0] && res.data[0].id,
        })
      },
    })
  },

  touchMap: function(res){
    console.log(res)
  },

  // 视野移动，获取中心位置
  handleRegion: function(e) {
    if (e.type === 'end' && (e.causedBy === 'drag' || e.causedBy === 'scale')) {
      this.getCenterLocation();
    }
  },

  // poi
  poitap: function(res) {
    this.setMarkers(res.detail, 1);
    this.setData({
      suggestions: [res],
    })
  },

  // 选择location
  selectLocation(e) {
    const { item } = e.detail;

    // 更新poi点，选择的位置和点击的poi位置公用一个marker
    this.setMarkers({
      longitude: item.location.lng,
      latitude: item.location.lat,
    }, 1);

    this.setData({
      selected: item.id,
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
