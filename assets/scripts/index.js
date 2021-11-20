let player = null;
// 视频上传
function upload(file) {
  $('.next-button').prop('disabled', true).css('cursor', 'wait')
  var formData = new FormData();
  formData.append("upload_preset", "youtubeclone");
  formData.append("file", file);
  var toastId = null;
  var config = {
    onUploadProgress: function onUploadProgress(p) {
      var progress = p.loaded / p.total;
      console.log(progress);

      if (toastId === null) {
        toastId = Toastify({
          text: "Upload in Progress......",
          // 不自动关闭
          duration: -1,
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast();
      }
    }
  };
  axios
    .post("https://api.cloudinary.com/v1_1/nllcoder/video/upload?upload_preset=youtube", formData, config)
    .then(function (res) {
      // 记录上传的视频地址
      window.uploadVideoUrl = res.data.url;
      $('.next-button').prop('disabled', false).css('cursor', 'pointer')
      toastId && toastId.hideToast(); 
    });
};

// 1. 上传文件控件，当选择文件，判断文件大小，视频预览，视频上传
$('#video-upload').on('change', function (e) {
  var file = e.target.files[0];
  if (file) {
    var size = file.size / 1000000;

    if (size > 30) {
       return Toastify({
        text: "文件大小不能超过30MB",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
      }).showToast()
    }
    // 设置预览视频的地址
    var preUrl = URL.createObjectURL(file); 

    // 显示弹出框
    $('.modal-wrapper').css('display', 'block'); 
    
    if (!player) {
      $('.video-preview div').html(`
        <video id="my-pre-player" class="video-js vjs-big-play-centered" controls preload="auto">
          <p class="vjs-no-js"> To view this video please enable JavaScript, and consider upgrading to a web browser that
            <a href="https://videojs.com/html5-video-support/" target="_blank"> supports HTML5 video </a>
          </p>
        </video>
      `);
      player = videojs('my-pre-player', {});
    }
    player.src({
      type: "video/mp4",
      src: preUrl
    }); 
    
    // 上传视频
    upload(file);
  }
});


// 点击关闭按钮，隐藏弹出框
$('.modal-header-left svg').on('click', function () {
  $('.modal-wrapper').css('display', 'none');
}); 

// 点击下一个按钮
$('.next-button').on('click', function () {
  if ($(this).text() === 'Next') {
    $('.video-preview').css('display', 'none');
    $('.video-form').css('display', 'block');
    $(this).text('Upload');
  } else {
    const url = window.uploadVideoUrl
    const imgUrl = url.substr(0, url.lastIndexOf('.') + 1) + 'jpg'

    // 记录上传的视频到自己的服务器
    http
      .post('/videos', {
        title: $('#title').val(),
        description: $('#description').val(),
        url: window.uploadVideoUrl,
        // 缩略图就是把视频的后缀改成 jpg
        thumbnail: imgUrl
      })
      .then(data => {
        if (data.success) {
          window.uploadVideoUrl = null
          $('.next-button').prop('disabled', true).css('cursor', 'wait')
          $('.modal-wrapper').css('display', 'none'); 
          $(this).text('Next');
          $('.video-preview').css('display', 'block');
          $('.video-form').css('display', 'none');

          http
          .get('/videos')
          .then(data => {
            if (data.success) {
              let html = template('tpl-videos', {
                videos: data.data
              })
              $('.videos').html(html)
            }
          })
        }
      })
  }
});


// 2. 渲染视频列表
http
  .get('/videos')
  .then(data => {
    if (data.success) {
      let html = template('tpl-videos', {
        videos: data.data
      })
      $('.videos').html(html)
    }
  })