require(['layui', 'axios', 'template'], function (layui, axios, template) {
  const { $, layer, form } = layui

  initTable()

  function initTable() {
    axios.get('/my/cate/list').then((res) => {
      const { code, data } = res.data

      if (code !== 0) return layer.msg('获取文章分类列表失败')

      const html = template('js-tpl-tr', data)

      $('#js-tbody').html(html)
    })
  }
  let addCateIndex

  // 打开添加文章分类弹窗
  $('#js-btn-add-cate').click(function (e) {
    e.preventDefault()

    addCateIndex = layer.open({
      title: '添加文章分类',
      type: 1,
      area: ['500px', '250px'],
      content: $('#js-tpl-add-cate').html()
    })
  })

  form.verify({
    cateName: [/^\S{1,10}$/, '只能是长度为1-10的非空字符串'],
    cateAlias: [/^[a-zA-Z0-9]{1,15}$/, '只能是长度为1-15的字母与数字']
  })

  // 监听添加文章分类表单提交事件
  form.on('submit(form-add-cate)', function () {
    const params = $('#js-form-add-cate').serialize()
    axios.post('/my/cate/add', params).then((res) => {
      const { code } = res.data

      if (code !== 0) return layer.msg('新增文章分类失败')

      layer.msg('新增文章分类成功')
      // 关闭添加分类弹层
      layer.close(addCateIndex)
      // 重新初始化分类表格
      initTable()
    })

    return false
  })

  // 委托代理的监听删除文章分类点击事件
  $('#js-tbody').on('click', '.js-btn-del', function (e) {
    e.preventDefault()

    const id = this.dataset.id

    layer.confirm(
      '确定要删除此文章分类吗？',
      { icon: 3, title: '提示' },
      function (index) {
        axios
          .delete('/my/cate/del', {
            params: {
              id
            }
          })
          .then((res) => {
            const { code } = res.data
            if (code !== 0) return layer.msg('删除文章分类失败')

            layer.msg('删除文章分类成功')

            // 重新渲染分类表格
            initTable()
          })
        layer.close(index)
      }
    )
  })

  // 打开添加文章分类弹窗
  let editCateIndex
  $('#js-tbody').on('click', '.js-btn-edit', function (e) {
    e.preventDefault()
    const id = this.dataset.id
    editCateIndex = layer.open({
      title: '修改文章分类',
      type: 1,
      area: ['500px', '250px'],
      content: $('#js-tpl-edit-cate').html()
    })

    axios
      .get('/my/cate/info', {
        params: {
          id
        }
      })
      .then((res) => {
        const { code, data } = res.data
        if (code !== 0) return layer.msg('获取文章分类信息失败')

        form.val('form-edit-cate', data)
      })
  })

  // 监听修改文章分类表单提交事件
  form.on('submit(form-edit-cate)', function () {
    const params = $('#js-form-edit-cate').serialize()

    axios.put('/my/cate/info', params).then((res) => {
      const { code } = res.data
      if (code !== 0) return layer.msg('修改文章分类失败')

      layer.msg('修改文章分类成功')

      // 重新渲染分类表格
      initTable()
      // 关闭修改文章分类弹窗
      layer.close(editCateIndex)
    })

    return false
  })
})
