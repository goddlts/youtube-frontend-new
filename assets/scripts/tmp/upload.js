;(function () {
  $('#video-upload').on('change', function (e) {
    const file = e.target.files[0]
    if (file) {
      const size = file.size / 1000000

      if (size > 30) {
        return toast.error("Sorry, file size should be less than 30MB")
      }

      const preUrl = URL.createObjectURL(file)
      // 显示弹出框
      $('.modal-wrapper').css('display', 'block')
      // 设置预览视频的地址
      $('.video-preview div').html(`<video
        id="my-pre-player"
        class="video-js vjs-big-play-centered"
        controls
        preload="auto">
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a
          web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>`)

      const player = videojs('my-pre-player', {
      })
      player.src({ type: "video/mp4", src: preUrl });

      // 上传视频
      upload(file)
    }
  })
})()


const upload = (file) => {
  const formData = new FormData();
  formData.append("upload_preset", "youtubeclone");
  formData.append("file", file);

  let toastId = null;
  const config = {
    onUploadProgress: (p) => {
      const progress = p.loaded / p.total
      console.log(progress)
      if (toastId === null) {
        toastId = Toastify({
          text: "Upload in Progress......",
          duration: -1, // 不自动关闭
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast()
        
      } else {
        // toastId = Toastify({
        //   text: "Upload in Progress......",
        //   duration: -1,
        //   backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        // }).showToast()
      }
    },
  }

  axios
    .post(
      `https://api.cloudinary.com/v1_1/nllcoder/video/upload?upload_preset=youtube`,
      formData,
      config
    )
    .then(res => {
      // console.log(res)
      toastId && toastId.hideToast()
      // 记录上传的视频地址
      window.uploadVideoUrl = res.data.secure_url
    })
    
}