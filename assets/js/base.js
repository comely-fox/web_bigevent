require.config({
  paths: {
    jquery: '/assets/lib/jquery',
    layui: '/assets/lib/layui/layui.all',
    axios: '/assets/lib/axios'
  },
  shim: {
    layui: {
      deps: ['jquery'],
      exports: 'layui'
    }
  }
})

require(['axios'], function (axios) {
  // 配置默认的请求根url
  axios.defaults.baseURL = 'http://www.liulongbin.top:3008'

  // 拦截请求, axios每次发起http请求时，都会调用拦截器
  axios.interceptors.request.use(
    (config) => {
      const { url, headers } = config

      if (url.includes('/my/')) {
        headers.Authorization = localStorage.getItem('token')
      }
      return config
    },

    // 发生请求错误
    (error) => {
      return Promise.reject(error)
    }
  )

  // 拦截服务器响应，每次服务器响应时，都优先调用此方法
  axios.interceptors.response.use(
    (response) => {
      // Do something before response is sent
      return response
    },
    (error) => {
      const { response } = error
      // 身份认证失败, 服务器返回错误状态码401
      if (response.status === 401) {
        window.top.location.href = '/login.html'
      }
      return Promise.reject(error)
    }
  )
})
