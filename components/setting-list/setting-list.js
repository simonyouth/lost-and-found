// components/setting-item/setting-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataSource: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTap(e) {
      console.log(e)
      const { key } = e.currentTarget.dataset;
      this.triggerEvent('handleitem', { key });
    },
  }
})
