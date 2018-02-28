const promisify = require('./promisify')
const getImageInfo = promisify(wx.getImageInfo)
const canvasGetImageData = promisify(wx.canvasGetImageData)

module.exports = {
  getImageInfo:getImageInfo,
  canvasGetImageData: canvasGetImageData
}