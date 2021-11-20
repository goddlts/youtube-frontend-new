(function () {
  http
    .get('/users/feed')
    .then(res => {
      if (res.success && res.data.length > 0) {
        const html = template.render($('#tpl-video').html(), {
          videos: res.data
        })
        $('.subscriptions_container').html(html)
      } else {
        loadUsers()
      }
    })

  function loadUsers () {
    http
      .get('/users')
      .then(res => {
        const html = template.render($('#tpl-user-list').html(), {
          userList: res.data
        })
        $('.subscriptions_container').html(html)
        // 订阅按钮注册事件
        subscribe()
      })
  }

  function subscribe () {
    $('.user-list .subscribe').each(function (index, item) {
      $(item).on('click', function () {
        const userId = $(this).attr('id')
        http
          .get(`/users/${userId}/togglesubscribe`)
          .then(res => {
            if (res.success) {
              $(this).toggleClass('active')
              const $link = $(this).prev()
              let count = parseInt($('.secondary span:first', $link).text())
              if ($(this).hasClass('active')) {
                $(this).text('Subscribe')
                $('.secondary span:first', $link).text(--count + ' subscribers')
              } else {
                $(this).text('Subscribed')
                $('.secondary span:first', $link).text(++count + ' subscribers')
              }
            }
          })
      })
    })
    // $('.subscribe').on('click', function () {
      // http
      //   .get(`/users/${userId}/togglesubscribe`)
      //   .then(res => {
      //     if (res.success) {
      //       $('.subscribe').toggleClass('active')
      //       if ($('.subscribe').hasClass('active')) {
      //         $('.subscribe').text('Subscribe')
      //       } else {
      //         $('.subscribe').text('Subscribed')
      //       }
      //     }
      //   })
    // })
  }
})()

// https://lg-youtube-api.herokuapp.com/api/v1/users/feed

// createdAt: "2020-10-16T06:33:23.308Z"
// description: "hehehe"
// id: "ac1b55df-5824-4562-85a1-1b6d1bcb0d6a"
// thumbnail: "https://res.cloudinary.com/nllcoder/video/upload/v1602829999/youtube/ya3e6nsttiyhes9ypr6z.jpg"
// title: "hehhe"
// updatedAt: "2020-10-16T06:33:23.308Z"
// url: "https://res.cloudinary.com/nllcoder/video/upload/v1602829999/youtube/ya3e6nsttiyhes9ypr6z.mp4"
// userId: "4121b65c-d916-4766-9847-c3afdef97272"

// avatar: "https://res.cloudinary.com/douy56nkf/image/upload/v1594060920/defaults/txxeacnh3vanuhsemfc8.png"
// id: "4121b65c-d916-4766-9847-c3afdef97272"
// username: "admin"



// https://lg-youtube-api.herokuapp.com/api/v1/users


// avatar: "https://res.cloudinary.com/douy56nkf/image/upload/v1594060920/defaults/txxeacnh3vanuhsemfc8.png"
// channelDescription: null
// id: "4121b65c-d916-4766-9847-c3afdef97272"
// isSubscribed: false
// subscribersCount: 0
// username: "admin"
// videosCount: 3