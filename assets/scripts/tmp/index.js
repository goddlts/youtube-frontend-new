;(function () {
  http
    .get('/videos')
    .then(res => {
      const html = template.render($('#tpl-video').html(), {
        videos: res.data
      })
      $('.videos').html(html)
    })
})()