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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    oninput(e) {
      const { value } = e.detail;
      this.triggerEvent('inputchange', { value })
    }
  }
});
