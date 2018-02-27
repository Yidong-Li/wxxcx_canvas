//index.js
//获取应用实例
const app = getApp();
const ctx = wx.createCanvasContext('mycanvas');
var orignalData = [];
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    dn:false,
    dnBtn:true,
    canvasWidth:0,
    canvasHeight:0,
    newSize:{
      width:0,
      height:0
    },
    offsetLeft:0,
    offsetTop:0
  },
  
  onLoad: function () {
    var that = this;
    wx.createSelectorQuery().select('#myCanvas').fields({
      dataset: false,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY']
    }, function (res){
      that.setData({
        canvasWidth:res.width,
        canvasHeight:res.height
      })
    }).exec();
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      success: function(res) {
        that.setData({
          dn:true
        });
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (t) {
            var newSize = that.resizeImage(t.width, t.height, that.data.canvasWidth, that.data.canvasHeight);
            that.setData({
              newSize:newSize
            });
            var offsetLeft,offsetTop;
            offsetLeft = (that.data.canvasWidth - newSize.width)/2;
            offsetTop = (that.data.canvasHeight - newSize.height)/2;
            that.setData({
              offsetLeft: offsetLeft,
              offsetTop: offsetTop
            });
            ctx.drawImage(res.tempFilePaths[0], offsetLeft, offsetTop, newSize.width, newSize.height);
            ctx.draw(false,()=>{
              that.setData({
                dnBtn:false
              });
              wx.canvasGetImageData({
                canvasId: 'mycanvas',
                x: that.data.offsetLeft,
                y: that.data.offsetTop,
                width: that.data.newSize.width,
                height: that.data.newSize.height,
                success(r) {
                  orignalData = r.data
                }
              })
            });
          }
        });
      },
    })
  },

  resizeImage: function(oldWidth,oldHeight,canvasWidth,canvasHeight){
    var newWidth, newHeight;
    var maxwidth = canvasWidth;
    var maxheight = canvasHeight;
    if (oldWidth > oldHeight) {
      if (oldWidth > maxwidth) {
        newHeight = oldHeight * (maxwidth / oldWidth);
        newWidth = maxwidth;
      }
    } 
    else {
      if (oldHeight > maxheight) {
        newWidth = oldWidth * (maxheight / oldHeight);
        newHeight = maxheight;
      }
    }
    return {
      width:newWidth,
      height:newHeight
    }
  },

  putImageData: function(data){
    var that = this;
    var unit8Data = new Uint8ClampedArray(data);
    wx.canvasPutImageData({
      canvasId: 'mycanvas',
      x: that.data.offsetLeft,
      y: that.data.offsetTop,
      width: that.data.newSize.width,
      height: that.data.newSize.height,
      data: unit8Data,
      success(res) {
        console.log(res);
      },
      fail(res){
        console.log(res);
      }
    })
  },

  reverseColor: function(){
    var that = this;
    wx.canvasGetImageData({
      canvasId: 'mycanvas',
      x: that.data.offsetLeft,
      y: that.data.offsetTop,
      width: that.data.newSize.width,
      height: that.data.newSize.height,
      success(r) {
        var newImageData = [];
        for (var i in r.data) {
          if (i % 4 != 3) {
            newImageData[i] = 255 - r.data[i];
          }
          else {
            newImageData[i] = 255;
          }
        }
        that.putImageData(newImageData);
      }
    })
  },

  blackWhite: function(){
    var that = this;
    wx.canvasGetImageData({
      canvasId: 'mycanvas',
      x: that.data.offsetLeft,
      y: that.data.offsetTop,
      width: that.data.newSize.width,
      height: that.data.newSize.height,
      success(r) {
        var newImageData = [];
        var imageData = r.data;
        for (var i=0;i <= imageData.length - 4;i += 4) {
          var average = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
          newImageData[i] = average;
          newImageData[i + 1] = average;
          newImageData[i + 2] = average;  
          newImageData[i + 3] = 255;
        }
        that.putImageData(newImageData);
      }
    })
  },

  recover:function(){
    this.putImageData(orignalData);
  }
})
