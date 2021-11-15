// axios 默认会将js对象序列化为json数据格式，从而content-type: application/json
require(['layui', 'axios', 'goIndexPage'], function (
  { $, form, layer },
  axios,
  goIndexPage
) {
  // 切换到注册窗口
  $('#js-to-reg').click(function (e) {
    e.preventDefault()

    $('#js-login-wraper').hide()
    $('#js-reg-wraper').show()
  })

  // 切换到登录窗口
  $('#js-to-login').click(function (e) {
    e.preventDefault()

    $('#js-login-wraper').show()
    $('#js-reg-wraper').hide()
  })

  // 自定义校验规则
  form.verify({
    usr: [/^[a-zA-Z0-9]{1,10}$/, '用户名必须是1-10位字母和数字'],
    pwd: [/^\S{6,15}$/, '密码长度必须是6-15位的非空字符串'],
    repwd: function (value) {
      const pwd = $('#js-reg-wraper [name="password"]').val()
      if (value !== pwd) {
        return '两次输入的密码不致'
      }
    }
  })

  // 监听登录表单事件
  form.on('submit(form-login)', function (data) {
    // 快速获取表单数据，并序列化成查询字符串
    const param = $('#js-form-login').serialize()
    axios.post('/api/login', param).then(function ({ data }) {
      const { code, token, message } = data

      // 登录失败
      if (code !== 0) return layer.msg('登录失败')

      // 登录成功
      layer.msg('登录成功')
      // 将token存储到本地
      localStorage.setItem('token', token)
      // 跳转到首页
      goIndexPage()
    })
    return false
  })

  form.on('submit(form-reg)', function () {
    const param = $('#js-form-reg').serialize()

    axios.post('/api/reg', param).then(function ({ data }) {
      const { code, token, message } = data

      // 登录失败
      if (code !== 0) return layer.msg(message)

      // 登录成功
      layer.msg('注册成功，请登录')
      // 模拟用户点击，切换到登录窗口
      $('#js-to-login').click()
    })

    return false
  })
})
