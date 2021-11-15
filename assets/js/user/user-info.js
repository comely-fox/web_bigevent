require(['layui', 'axios'], function (lay, axios, initUserInfo) {
  const { form, layer } = lay
  // 自定义校验规则
  form.verify({
    nickname: [/^\S{1,10}$/, '昵称长度必须是1-10位的非空字符串']
  })
  initUserInfo()
  function initUserInfo() {
    // 初始化表单的用户基本信息
    axios.get('/my/userinfo').then((res) => {
      const { code, data } = res.data
      if (code !== 0) return layer.msg('获取用户信息失败')

      form.val('form-userinfo', data)
    })

    return false
  }

  form.on('submit(form-editInfo)', function (data) {
    const params = new URLSearchParams(data.field)

    axios.put('/my/userinfo', params).then((res) => {
      const { code } = res.data
      if (code !== 0) return layer.msg('修改用户信息失败')

      layer.msg('修改用户信息成功')

      window.parent.require(['initUserInfo'], (initUserInfo) => initUserInfo())
    })

    return false
  })

  form.on('submit(form-reset)', initUserInfo)
})
