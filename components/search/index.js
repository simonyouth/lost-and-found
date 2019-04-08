// components/search/index.js
Component({
  /**
   * 外部样式类
   */
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchValue: String,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputconfirm(e) {
      const { value } = e.detail;
      this.triggerEvent('confirm', { value })
    },
    onchange(e) {
      const { value } = e.detail;
      this.setData({
        searchValue: value,
      })
    },
    searchtap() {
      const { searchValue } = this.data;
      this.triggerEvent('confirm', { value: searchValue })
    }
  }
});
