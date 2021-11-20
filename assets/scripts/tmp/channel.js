;(function () {
  function tab () {
    $('.tabs li').removeClass('active')
    $('.my-videos .tab').css('display', 'none')

    $('.tabs li').first().addClass('active')
    $('.my-videos .tab').first().css('display', 'block')

    $('.tabs li').on('click', function () {
      $('.tabs li').removeClass('active')
      $('.my-videos .tab').css('display', 'none')

      $(this).addClass('active')
      const index = $(this).index()
      $('.my-videos .tab').eq(index).css('display', 'block')
    })
  }
  // 初始化
  tab()

  function loadVideos (videos) {
    const html = template.render($('#tpl-videos').html(), {
      videos: videos
    })
    $('.tab-item').html(html)
  }

  function loadChannels (users) {
    const html = template.render($('#tpl-channels').html(), {
      users: users
    })
    $('.tab-users').html(html)
  }

  function loadInfo (info) {
    const html = template.render($('#tpl-tab-info').html(), {
      info: info
    })
    $('.tab-info').html(html)
  }

  // 获取自己的id
  const user = JSON.parse(localStorage.getItem('user'))
  // console.log(user)
  http
    .get(`/users/${user.id}`)
    .then(res => {
      if (res.success) {
        // 显示个人信息
        const html = template.render($('#tpl-user-info').html(), {
          user: res.data
        })
        $('.user-header').html(html)
        // 显示信息
        loadVideos(res.data.videos)
        loadChannels(res.data.channels)
        loadInfo(res.data.channelDescription)
      }
    })
})()

// avatar: "https://res.cloudinary.com/douy56nkf/image/upload/v1594060920/defaults/txxeacnh3vanuhsemfc8.png"
// channelDescription: null
// channels: []
// cover: "https://res.cloudinary.com/douy56nkf/image/upload/v1594060919/defaults/xcdnczly5nuwpibolagv.png"
// email: "xxx@xxx.xxx"
// firstname: "abc"
// id: "25a92206-765f-40f4-948e-9228f56a0095"
// isMe: true
// isSubscribed: false
// lastname: "abc"
// subscribersCount: 0
// username: "abcabc"

// channels
// avatar: "https://res.cloudinary.com/douy56nkf/image/upload/v1594060920/defaults/txxeacnh3vanuhsemfc8.png"
// id: "119c4a08-40dc-489f-b8d9-0508de119ebe"
// subscribersCount: 1
// username: "xxxxx000"

// videos
// createdAt: "2021-02-24T09:58:02.000Z"
// id: "1bb2b065-029e-46fc-ac2a-f8559697097c"
// thumbnail: "https://res.cloudinary.com/nllcoder/video/upload/v1614160672/youtube/yfoynprgdidjhtcj12wf.jpg"
// title: "xxxxx"
// views: 2