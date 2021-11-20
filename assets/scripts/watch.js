// 获取url参数
let query = getQuery(location.search)
const videoId = query.id
http
  .get(`/videos/${query.id}`, {
    // 设置请求头中的token
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then(res => {
    const data = res.data
    if (data.success) {
      // 渲染视频详情
      const videoHtml = template('tpl-video', {
        video: data.data
      })
      $('.video-container').html(videoHtml)
      // 渲染评论列表
      const commentsHtml = template('tpl-comments', {
        comments: data.data.comments
      })
      $('.comment-container .list').html(commentsHtml)
      // 渲染右侧视频列表
      loadRelatedVideos(videoId)
      // 设置支持和反对
      setLikeOrDislike(data.data)

      // 发表评论
      sendComment(data.data)
      // 注册订阅按钮事件
      subscribe(data.data.userId)
      // 播放当前视频
      const player = videojs('my-player', {
        autoplay: true,
        muted: 'muted',
      }, function () {
        this.on('ended', function () {
          videojs.log('播放结束了!')
          // 如果已看过，返回
          if (data.data.isViewed) return
          // 视频播放结束
          // 让播放次数+1
          updateViews(videoId)
        })
      })
      player.src({
        type: "video/mp4",
        src: data.data.url
      }); 
    }
  })

// 设置支持和反对
function setLikeOrDislike (video) {
  if (video.isLiked) {
    $('.like svg').css('fill', 'rgb(62, 166, 255)')
    $('.dislike svg').css('fill', 'rgb(56, 56, 56)')
  } else if (video.isDisliked) {
    $('.dislike svg').css('fill', 'rgb(62, 166, 255)')
    $('.like svg').css('fill', 'rgb(56, 56, 56)')
  } else {
    $('.like svg').css('fill', 'rgb(56, 56, 56)')
    $('.dislike svg').css('fill', 'rgb(56, 56, 56)')
  }
  // 点赞或取消点赞
  likeOrDislike(video)
}

// 支持或反对
function likeOrDislike (video) {
  $('.like svg').on('click', function () {
    request(video, 'like', { isLiked: true })
  })

  $('.dislike svg').on('click', function () {
    request(video, 'dislike', { isDisliked: true })
  })

  function request (video, type, isLike) {
    http
      .get(`videos/${video.id}/${type}`, {
        // 设置请求头中的token
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(res => {
        const data = res.data
        if (data.success) {
          if (video.isLiked && type === 'like') {
            video.isLiked = false
            let c = parseInt($(`.${type} svg`).next().text())
            $(`.${type} svg`).next().text(c - 1)
            setLikeOrDislike({})
          } else if (video.isDisliked && type === 'dislike') {
            video.isDisliked = false
            let c = parseInt($(`.${type} svg`).next().text())
            $(`.${type} svg`).next().text(c - 1)
            setLikeOrDislike({})
          } else {
            let c = parseInt($(`.${type} svg`).next().text())
            $(`.${type} svg`).next().text(c + 1)

            type = type === 'like' ? 'dislike' : 'like'
            c = parseInt($(`.${type} svg`).next().text())
            if (c > 0) {
              $(`.${type} svg`).next().text(c - 1)
            }
            video.isLiked = !!obj.isLiked
            video.isDisliked = !!obj.isDisliked
            setLikeOrDislike(obj)
          }
        }
      })
  }
}

// 视频播放完成更新播放次数
function updateViews (videoId) {
  http
    .get(`/videos/${videoId}/view`, {
      // 设置请求头中的token
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(res => {
      const data = res.data
      if (data.success) {
        let count = parseInt($('.video-info-stats span:first').text())
        $('.video-info-stats span:first').text(++count + ' views')
      }
    })
}

// 渲染右侧播放列表
function loadRelatedVideos (videoId) {
  http
    .get('/videos')
    .then(res => {
      const data = res.data
      const videos = data.data.filter(item => {
        return item.id !== videoId
      })
      const html = template('tpl-related-videos', {
        videos: videos.splice(0, 4)
      })
      $('.related-videos').html(html)
    })
}

// 发送评论
function sendComment (video) {
  const comments = video.comments
  $('.add-comment textarea').on('keypress', function (e) {
    if (e.key !== 'Enter') return
    http
      .post(`videos/${video.id}/comment`, {
        text: this.value,
      }, {
        // 设置请求头中的token
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(res => {
        if (res.data.success) {
          comments.unshift(res.data.data)
          $('.comment-container h3').text(`${comments.length} comments`)
          // 评论列表的渲染
          const commentHtml = template('tpl-comments', {
            comments: comments
          })
          $('.comment-container .list').html(commentHtml)
        }
      })
    e.preventDefault()
    // return false
  })
}

// 订阅和取消订阅
function subscribe (userId) {
  $('.subscribe').on('click', function () {
    http
      .get(`/users/${userId}/togglesubscribe`, {
          // 设置请求头中的token
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      })
      .then(res => {
        if (res.data.success) {
          $('.subscribe').toggleClass('active')
          // 计算订阅人数
          let count = parseInt($('.channel-info-meta .secondary.small').text())
          if ($('.subscribe').hasClass('active')) {
            $('.channel-info-meta .secondary.small').text(--count + ' subscribers')
            $('.subscribe').text('Subscribe')
          } else {
            $('.channel-info-meta .secondary.small').text(++count + ' subscribers')
            $('.subscribe').text('Subscribed')
          }
        }
      })
  })
}

