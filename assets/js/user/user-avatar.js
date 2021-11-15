require(['layui', 'axios', 'cropperjs'], function (layui, axios, Cropper) {
  const { layer, $ } = layui

  // 1. 获取原始图片元素
  const $image = $('#image')
  // 2. 配置cropper配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区
  let cropper = new Cropper($image[0], options)

  $('#js-btn-choose-avatar').click(function (e) {
    e.preventDefault()

    $('#js-file').click()
  })

  $('#js-file').change(function (e) {
    e.preventDefault()
    const files = e.target.files
    if (files.length === 0) return layer.msg('请选择图片')

    const file = files[0]

    const url = URL.createObjectURL(file)
    $image.attr('src', url)
    // 4. 销毁原裁剪区
    cropper.destroy()
    // 5. 重新初始化裁剪区
    cropper = new Cropper($image[0], options)
  })

  $('#js-btn-upload').click(function () {
    const canvas = cropper.getCroppedCanvas()
    // 将裁剪的图像转换为base64编码格式
    const base64 = canvas.toDataURL('image/png')

    // 发送更新局部数据请求
    axios
      .patch(
        '/my/update/avatar',
        new URLSearchParams({
          avatar: base64
        })
      )
      .then((res) => {
        const { code } = res.data
        if (code !== 0) return layer.msg('头像更换失败')

        layer.msg('头像更换成功')

        window.parent.require(['InitUserInfo'], (InitUserInfo) =>
          InitUserInfo()
        )
      })
  })
})
