// components/card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes: {
    attached() {
     
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTap(e) {
      const { id } = e.target.dataset;
      this.triggerEvent('ondetail', { id })
    },
    previewImage(e) {
      // 本地测试图片，无法预览
      const { current, urls } = e.target.dataset;
      wx.previewImage({
        urls,
        current,
        fail: (e) => { console.log(e)}
      })
    }
  }
})
