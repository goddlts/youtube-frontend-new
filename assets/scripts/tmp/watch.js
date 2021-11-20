;(function () {
  let comments = []
  // 获取url上的id
  const query = getQuery()
  const id = query.id
  // 获取视频详情
  http
    .get(`/videos/${id}`)
    .then(res => {
      const html = template.render($('#tpl-video').html(), {
        video: res.data
      })
      $('.video-container').html(html)
      comments = res.data.comments
      // 评论列表的渲染
      const commentHtml = template.render($('#tpl-comment').html(), {
        comments: comments
      })
      $('.comment-container .list').html(commentHtml)
      // 设置喜欢或者不喜欢
      setLikeOrDislike(res.data)
      // 视频自动播放
      const player = videojs('my-player', {
        autoplay: true,
        muted: 'muted'
      }, function () {
        this.on('ended', function() {
          videojs.log('播放结束了!')
          if (res.data.isViewed) return
          // 视频播放结束
          // 让播放次数+1
          http
            .get(`/videos/${id}/view`)
            .then(res => {
              if (res.success) {
                console.log($('.video-info-stats span'))
                const count = parseInt($('.video-info-stats span:first').text())
                $('.video-info-stats span:first').text(++count + ' views')
              }
            })
        })
      })
      // 获取下一个的播放列表
      getNextVideos(res.data.id)
      // 点喜欢或者不喜欢
      likeOrDislike(res.data)
      // 发送评论的文本框注册事件
      sendComment(id)
      // 注册订阅按钮事件
      subscribe(res.data.userId)
    })

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
  }

  function likeOrDislike (video) {
    $('.like svg').on('click', function () {
      request(video, 'like', { isLiked: true })
    })

    $('.dislike svg').on('click', function () {
      request(video, 'dislike', { isDisliked: true })
    })

    function request (video, type, obj) {
      http
        .get(`videos/${video.id}/${type}`)
        .then(res => {
          if (res.success) {
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

  function getNextVideos (id) {
    http
      .get('/videos')
      .then(res => {
        const videos = res.data.filter(item => {
          return item.id !== id
        })

        const html = template.render($('#tpl-related-video').html(), {
          videos: videos.splice(0, 3)
        })
        $('.related-videos').html(html)
      })
  }

  function sendComment (id) {
    $('.add-comment textarea').on('keypress', function (e) {
      if (e.key !== 'Enter') return
      http
        .post(`videos/${id}/comment`, {
          text: this.value
        })
        .then(res => {
          if (res.success) {
            comments.unshift(res.data)
            $('.comment-container h3').text(`${comments.length} comments`)
            // 评论列表的渲染
            const commentHtml = template.render($('#tpl-comment').html(), {
              comments: comments
            })
            $('.comment-container .list').html(commentHtml)
          }
        })
    })
  }
  // 
  function subscribe (userId) {
    $('.subscribe').on('click', function () {
      http
        .get(`/users/${userId}/togglesubscribe`)
        .then(res => {
          if (res.success) {
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
})()
