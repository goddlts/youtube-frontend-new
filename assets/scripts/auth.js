// 1. 控制显示隐藏
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


// 2. 登陆
$('#formLogin').validate({
  onBlur: true,
  onKeyup: true,
  sendForm: false,
  description: {
    email: {
      required: '邮箱不能为空!',
      pattern: '邮箱地址格式不正确！'
    },
    password: {
      required: '密码不能为空!',
      pattern: '密码只能为数字和字母且不能少于6位!'
    }
  },
  valid: function () {
    // 发送请求，进行登陆操作
    http
      .post('/auth/login', $(this).serializeObject())
      .then(res => {
        console.log(res)
        const data = res.data
        
        if (data.success) {
          // 登录成功记录 token
          // data => { success: true, data: 'token' }
          window.localStorage.setItem('token', data.data)
          // 提示
          Toastify({
            text: "登录成功",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast()

          location.href = '/index.html'
        } else {
          Toastify({
            text: "登陆失败",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast()
        }

      }).catch(err => {
        Toastify({
          text: err.response.data?.message || '登陆失败',
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast()
      }) 
  },
  invalid: function () {
  }
})

// 3. 注册
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
    })
    .catch(err => {
      Toastify({
        text: err.response.data?.message || '注册失败',
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
      }).showToast()
    })
  return false
})

