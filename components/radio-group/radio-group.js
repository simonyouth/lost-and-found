// components/radio-group/radio-group.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataSource: Array,
    selected: String,
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
      const { item } = e.currentTarget.dataset;
      this.triggerEvent('select', { item })
    }
  }
});
