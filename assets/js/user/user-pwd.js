require(['layui', 'axios'], function (lay, axios, initUserInfo) {
  const { form, layer, $ } = lay

  // 自定义校验规则
  form.verify({
    pwd: [/^\S{6,15}$/, '密码长度必须是6-15位的非空字符串'],
    repwd: function (val) {
      if (val !== $('[name="new_pwd"]').val()) {
        return '两次输入的密码不一致'
      }
    },
    // 重复旧密码
    reoldpwd: function (val) {
      if (val === $('[name="old_pwd"]').val()) {
        return '新密码不能与旧密码一样'
      }
    }
  })

  form.on('submit(form-update-pwd)', function (data) {
    const params = new URLSearchParams(data.field)

    axios.patch('/my/updatepwd', params).then((res) => {
      const { code } = res.data
      if (code !== 0) return layer.msg('修改用户密码失败')

      layer.msg('密码修改成功')
    })

    return false
  })
})
