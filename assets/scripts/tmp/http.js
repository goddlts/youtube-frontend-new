// https://lg-youtube-api.herokuapp.com/api/v1
// http://localhost:5000/api/v1
// https://utubeclone2.herokuapp.com/api/v1/
const http = axios.create({
  baseURL: 'http://82.156.8.100:9001/api/v1',
  // baseURL: 'https://lg-youtube-api.herokuapp.com/api/v1',
  // baseURL: 'https://utubeclone2.herokuapp.com/api/v1/',
  timeout: 10000
})

http.interceptors.request.use(function (config) {
  NProgress.start()
  // do something before request is sent
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.token) {
    config.headers['authorization'] = 'Bearer ' + user.token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
http.interceptors.response.use(function (response) {
  NProgress.done()
  if (response.status !== 200 && response.status !== 201) {
    // ToDo错误提示
    Toastify({
      text: '服务器错误',
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
    }).showToast()
    return Promise.reject(new Error(response.statusText || 'Error'))
  }
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  const res = response.data
  return res
}, function (error) {
  NProgress.done()
  // 非200的错误，都在这里
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (!error.response) {
    Toastify({
      text: '服务器连接不成功',
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
    }).showToast()
  } else if (error.response.data && error.response.data.message) {
    Toastify({
      text: error.response.data.message,
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast()

    if (error.response.status === 401) {
      setTimeout(() => {
        window.location.href = '/login.html'
      }, 3000);
    }
  } else {
    
    Toastify({
      text: error.response.statusText,
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
    }).showToast()
    
  }
  
  return Promise.reject(error)
})