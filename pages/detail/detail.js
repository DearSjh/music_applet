// pages/detail/detail.js
Page({
  onShareAppMessage() {
    return {
      title: 'audio',
      path: 'page/component/pages/audio/audio'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
   song:[],
    playStatu:'stop.png',
    back:'',
   play:false,
    songError:'',
    audioAction: {
      method: 'start'
    }
  },
  stopPlay:function(){
    if(this.data.playStatu =='stop.png'){
      this.setData({
        playStatu: 'play.png'
      })
      wx.getBackgroundAudioManager().pause();
    }else{
      this.setData({
        playStatu: 'stop.png'
      })
      wx.getBackgroundAudioManager().play();
    }
    
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: 'https://api.bzqll.com/music/netease/song?key=579621905&id=' + options.id,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // console.log(res);
        if (res.data.code == 200) { //当歌词查询成功
          let song = res.data.data;
          let url = res.data.data.url;
          console.log(res.data.data);
          that.setData({
            song:song
          })
          
          const back = wx.getBackgroundAudioManager();
          back.src = url;
          back.title =song.name;
          back.coverImgUrl =song.pic;
          back.play(function(){
            that.setData({
              playStatu:'stop.png',
              back:back
            })
          });
          // back.onPlay(() => {
          //   that.setData({
          //     playStatu: 'stop.png'
          //   })
          // })
          // back.onPause(()=>{
          //   that.setData({
          //     playStatu:'play.png'
          //   })
          //   console.log(that.data.playStatu);
          // })
          back.onEnded(() => {
            console.log("音乐播放结束");
          })
          // console.log(song);
        } else { // 歌词查询出错
          that.setData({
           songError:'获取歌曲信息失败'
          })
        }

      },
      fail: function () {
        that.setData({
          songError: '获取歌曲信息失败'
        })
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