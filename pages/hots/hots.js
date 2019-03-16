// pages/hots/hots.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图部分数据
    imgUrls: [
      '/image/lunbo1.png',
      '/image/lunbo2.png',
      '/image/lunbo3.png'
    ],
    hotList:'',
    theEnd2:true,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    songs:[],
    keywords:'',
    songListName:'',
    songListDescription:'',
    searchEnd: [], //列表
    theEnd: false  //是否显示搜索结果
  },
  // 轮播图部分开始
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  // 轮播图结束

  searchResult: function () {
    var keywords = this.data.keywords;
    // console.log('111'+keywords);
    wx.navigateTo({
      url: '../searchResult/searchResult?keywords='+keywords,
    })
  },
  searchTap(e) {
    //1.获取关键词
    var keywords = e.detail.value
    // console.log(keywords);
    //2.判断过滤
    if (!keywords) {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      keywords:keywords
    })
    //3.发送请求设置数据
    wx.request({
      url: 'https://api.bzqll.com/music/netease/search?key=579621905&type=song&limit=10&offset=0&s='+ keywords,
      success: res => {
        // console.log(res.data.code);
        // console.log(res.data);
        if (res.data.code == 200) {
          let searchEnd = res.data.data;
          this.setData({
            searchEnd: res.data.data,
            theEnd: true,
            theEnd2:false
          })
        } else {
          this.setData({
            searchEnd: [],
            theEnd: false,
            theEnd2:true
          })
        }
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.request({
        url: 'https://api.bzqll.com/music/netease/highQualitySongList?key=579621905&cat=全部&limit=6',
        success: res => {
          // console.log(res.data.data);
          // console.log(res);
          if (res.data.code == 200) {
            let hotList = res.data.data.playlists;
            this.setData({
              hotList: hotList
            })
          } else {
            this.setData({
              hotList: []
            })
          }
        }
      })

      wx.request({
        url:'https://api.bzqll.com/music/netease/songList?key=579621905&id=19723756&limit=10',
        success: res => {
          // console.log(1);
          // console.log(res);
          //发送成功设置数据
          if (res.data.code == 200) {
            // console.log(res.data.data.songListName);
            // console.log(res.data.data.songListDescription);
            // console.log(res.data.data.songs);
            let songListName = res.data.data.songListName;
            let songListDescription = res.data.data.songListDescription;
            let songs = res.data.data.songs;
            this.setData({
              songListName: songListName,
              songListDescription: songListDescription,
              songs:songs
            })
          }else{
              wx.showToast({
              title: '数据获取失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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