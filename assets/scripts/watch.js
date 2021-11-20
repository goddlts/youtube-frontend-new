const player = videojs('my-player', {
  autoplay: true,
  muted: 'muted'
}, function () {
  this.on('ended', function () {
    videojs.log('播放结束了!')
  })
})