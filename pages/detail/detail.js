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
    percent:0,
    duration:'',
    zhuanma:'running',
    currentTime:'',
    i:2,
    pic:'',
   song:[],
   songName:'',
    playStatu:'stop.png',
    back:'',
    songList:[],
   play:false,
    songError:'',
    audioAction: {
      method: 'start'
    }
  },
  lastSong: function () {
    var i = Math.floor((Math.random() * this.data.songList.length));
    this.setData({
      song: this.data.songList[i]
    })
    const last = wx.getBackgroundAudioManager();
    last.src = this.data.songList[i].url;
    last.title = this.data.songList[i].name;
    last.coverImgUrl = this.data.songList[i].pic;
    // console.log(this.data.songList[this.data.i]);
    // next.play();
  },
  nextSong:function(){
    var i = Math.floor((Math.random() * this.data.songList.length));
    const next = wx.getBackgroundAudioManager();
    this.setData({
      song: this.data.songList[i]
    })
    next.src = this.data.songList[i].url;
    next.title = this.data.songList[i].name;
    next.coverImgUrl = this.data.songList[i].pic;
    // console.log(this.data.songList[this.data.i]);
    // next.play(function () {
    //   this.setData({
    //     pic: this.data.songList[i].pic
    //   })
    //   console.log(this.data.pic);
    // });
  },
  stopPlay:function(){
    if(this.data.playStatu =='stop.png'){
      this.setData({
        playStatu: 'play.png',
        zhuanma:'paused'
      })
      wx.getBackgroundAudioManager().pause();
    }else{
      this.setData({
        playStatu: 'stop.png',
        zhuanma:'running'
      })
      wx.getBackgroundAudioManager().play();
    }
    
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getBackgroundAudioPlayerState({
      success(res) {
        var status = res.status
        const dataUrls = res.dataUrl.indexOf('?');
        const dataUrle = res.dataUrl.indexOf('&');
        var id = (status == 2?'28285910':res.dataUrl.slice(dataUrls+4,dataUrle));
        var currentPosition = res.currentPosition
        const duration = res.duration
          wx.request({
            url:'https://api.bzqll.com/music/netease/song?key=579621905&id='+id,
            method:'GET',
            success:function(res){
              if (res.data.code == 200) { //当歌查询成功
                let song = res.data.data;
                let url = res.data.data.url;
                const back = wx.getBackgroundAudioManager();
                  back.onTimeUpdate(function () {
                  var currentTime = back.currentTime;
                  var percent = Math.floor(100 * currentTime / duration);
                  that.setData({
                      currentTime: Math.floor(currentTime),
                      percent: percent
                    })
                  })
                that.setData({
                  song: song,
                  songName:song.name,
                  pic: song.pic
                  
                })
                    wx.request({
                      url: 'https://api.bzqll.com/music/netease/search?key=579621905&type=song&limit=100&offset=0&s=' + that.data.song.name,
                      success: res => {
                        // console.log(res.data.code);
                        console.log(res.data);
                        if (res.data.code == 200) {
                          let searchEnd = res.data.data;
                          // console.log(options.songName);
                          that.setData({
                            songList: res.data.data,
                          })
                          // console.log(this.data.songList[0]);
                        } else {
                          taht.setData({
                            songList: [],
                          })
                        }
                      }
                    })
              }
            }
          })
          

      }
    })
    wx.request({
      // url:'https://api.bzqll.com/music/netease/song?key=579621905&id=526307800',
      url: 'https://api.bzqll.com/music/netease/song?key=579621905&id=' + options.id,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // console.log(res);
        if (res.data.code == 200) { //当歌查询成功
          let song = res.data.data;
          let url = res.data.data.url;
          // console.log(res.data.data);
          that.setData({
            song:song,
            pic:song.pic,
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
          back.onPlay(() => {
            that.setData({
              playStatu: 'stop.png',
              zhuanma:'running',
              // currentTime:back.currentTime,
              // duration:back.duration
            })
          })
          //系统面板下一首
          back.onNext(function(){
            var i = Math.floor((Math.random() * this.data.songList.length));
            const next = wx.getBackgroundAudioManager();
            this.setData({
              song: this.data.songList[i]
            })
            next.src = this.data.songList[i].url;
            next.title = this.data.songList[i].name;
            next.coverImgUrl = this.data.songList[i].pic;
          })
          //系统面板上一首
          back.onPrev(function(){
            var i = Math.floor((Math.random() * this.data.songList.length));
            this.setData({
              song: this.data.songList[i]
            })
            const last = wx.getBackgroundAudioManager();
            last.src = this.data.songList[i].url;
            last.title = this.data.songList[i].name;
            last.coverImgUrl = this.data.songList[i].pic;
          })
        
          back.onTimeUpdate(function(){
            const back = wx.getBackgroundAudioManager();
              var currentTime =back.currentTime;
              var percent =Math.floor(100*currentTime/that.data.song.time);
              // if(percent!=that.data.percent){
              //   that.setData({
              //     currentTime: Math.floor(currentTime),
              //     percent: percent
              //   })
              // }else{
                that.setData({
                  currentTime: Math.floor(currentTime),
                  percent: percent
                })
              // }
              // console.log(percent);
          })
          back.onPause(()=>{
            that.setData({
              playStatu:'play.png',
              zhuanma:'paused'
            })
            // console.log(that.data.playStatu);
          })
          back.onEnded(() => {
            var i = Math.floor((Math.random() * that.data.songList.length));
            const next = wx.getBackgroundAudioManager();
            that.setData({
              song: that.data.songList[i]
            })
            next.src = that.data.songList[i].url;
            next.title = that.data.songList[i].name;
            next.coverImgUrl = that.data.songList[i].pic;
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

    wx.request({
      url: 'https://api.bzqll.com/music/netease/search?key=579621905&type=song&limit=100&offset=0&s=' + options.songName,
      success: res => {
        // console.log(res.data.code);
        // console.log(res.data);
        if (res.data.code == 200) {
          let searchEnd = res.data.data;
          // console.log(options.songName);
          this.setData({
            songList: res.data.data,
          })
          // console.log(this.data.songList[0]);
        } else {
          this.setData({
            songList: [],
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