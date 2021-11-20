;(function handleLogin(w) {
  $('#formLogin').on('submit', function () {
    http
      .post('/auth/login', $(this).serializeObject())
      .then(res => {
        console.log(res)
        // 登录成功记录 token
        // res => { success: true, data: 'token' }
        // 提示
        Toastify({
          text: "登录成功",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast()
        getMyInfo(res.data)
      })
    return false
  })

  $('#formRegister').on('submit', function () {
    http
      .post('/auth/signup', $(this).serializeObject())
      .then(res => {
        // 登录成功记录 token
        // res => { success: true, data: 'token' }
        // 提示
        Toastify({
          text: "注册成功",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast()
        getMyInfo(res.data)
      })
    return false
  })

  function getMyInfo (token) {
    http
      .get('/auth/me', {
        headers: {
          authorization: 'Bearer ' + token
        }
      })
      .then(res => {
        res.data.token = token
        localStorage.setItem('user', JSON.stringify(res.data))
        // 跳转到首页
        window.location.href = '/index.html'
      })
  }

  $('#panelRegister').css('display', 'none')
  // 显示隐藏控制
  $('#btnLogin').on('click', function () {
    $('#panelLogin').css('display', 'block')
    $('#panelRegister').css('display', 'none')
  })

  $('#btnRegister').on('click', function () {
    $('#panelLogin').css('display', 'none')
    $('#panelRegister').css('display', 'block')
  })
}(window))