;(function () {
  // 点击关闭按钮，隐藏弹出框
  $('.modal-header-left svg').on('click', function () {
    $('.modal-wrapper').css('display', 'none')
  })

  // 点击下一个按钮
  $('.next-button').on('click', function () {
    if ($(this).val() === 'Next') {
      $('.video-preview').css('display', 'none')
      $('.video-form').css('display', 'block')
      $(this).val('Upload')
    } else {
      // 记录上传的视频到自己的服务器
      http
        .post('/videos', {
          title: $('#title').val(),
          description: $('#description').val(),
          url: '',
          // 缩略图就是把视频的后缀改成 jpg
          thumbnail: ''
        })
    }
  })



  // https://lg-youtube-api.herokuapp.com/api/v1/videos
  // {"title":"234","description":"234","url":"https://res.cloudinary.com/nllcoder/video/upload/v1614246247/youtube/c8wkzjaxkfaekyxoa7b2.mp4","thumbnail":"https://res.cloudinary.com/nllcoder/video/upload/v1614246247/youtube/c8wkzjaxkfaekyxoa7b2.jpg"}
})()