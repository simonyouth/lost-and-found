import { formList } from './constant';
import { type, tipsForSafe } from '../../utils/store';
import { httpRequest, uploadImg } from '../../utils/request';

const type2Word = { lost: '失物贴', found: '寻物贴' };
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formList: formList,
    sortType: type,
    routerType: 'found', // lost, found
    picList: [], // 图片列表
    formData: {},
    tip: '*', // 必填提示
    tipsForSafe: tipsForSafe,
  },

  toMap(e) {
    const { name } = e.target.dataset;
    wx.chooseLocation({
        success: res => {
          this.setData({
            address: res.address,
          });
          this.updateFormData(name, res.address)
        }
    })
  },
  pickerChange(e) {
    const { name } = e.target.dataset;
    const { value } = e.detail;
    this.setData({
      index: value
    });
    this.updateFormData(name, value)
  },

  updateFormData(key, value) {
    const { formData } = this.data;
    const data = { ...formData };
    data[key] = value;
    this.setData({
      formData: data,
    });
  },
  input(e) {
    const { value } = e.detail;
    const { name } = e.target.dataset;
    this.updateFormData(name, value)
  },
  uploadPicture() {
    wx.chooseImage({
      success: res => {
        this.setData({
          picList: res.tempFilePaths,
        })
      }
    });
  },
  formSubmit(e) {
    const { value } = e.detail;
    const { picList } = this.data;
    // 判断空
    if (!value.title || !value.content
      || !value.location || !value.category) {
      this.setData({
        tip: '必填项不能为空！'
      })
    } else {
      wx.showLoading({
        title: '发布中',
      });
      // 发布时上传图片到服务器
      const arr = picList.map(path => uploadImg(path));
      Promise.all(arr)
        .then(urls => {
          const imgList = urls.map(v => JSON.parse(v.data).data);
          const { routerType } = this.data;
          // 发布请求
          httpRequest({
            url: `${routerType}/publish`,
            method: 'POST',
            data: {
              ...value,
              imgList,
            },
          }).then(res => {
            if (res.data.success) {
              wx.hideLoading();
              const pages = getCurrentPages();
              const home = pages[0];
              home.search({ clear: true });

              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          })
        });
    }
  },
  formReset() {
    // 重置
    this.setData({
      picList: [],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type } = options;
    wx.setNavigationBarTitle({
      title: `发布${type2Word[type]}`
    });
    this.setData({
      routerType: type
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
})