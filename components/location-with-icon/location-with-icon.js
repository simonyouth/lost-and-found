import { qqmap } from '../../utils/util'
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    location: String,
    hasEvent: Boolean,
  },
  methods: {
    // 根据location显示地理位置
    showMap() {
      if (!this.data.hasEvent) {
        qqmap.geocoder({
          address: this.data.location,
          success: ({result}) => {
            console.log(result)
            wx.openLocation({
              longitude: result.location.lng,
              latitude: result.location.lat,
            })
          }
        })
      } else {
        this.triggerEvent('tap')
      }

    },
  }
});
