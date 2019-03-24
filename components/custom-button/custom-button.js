Component({
  externalClasses: ['custom-button'],
  properties: {
    text: String,
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
      this.triggerEvent('customaction');
    }
  }
})
