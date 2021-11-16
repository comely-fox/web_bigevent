require(['layui', 'axios', 'template', 'moment'], function (
  layui,
  axios,
  template,
  moment
) {
  const { layer, form, laypage } = layui

  // 分页选项，获取文章列表查询参数
  const q = {
    pagenum: 1, // 当前页
    pagesize: 1, // 每页显示的条数
    cate_id: '', // 可选，文章的分类的id
    state: '', // 可选，文章发布的状态：已发布，草稿
    total: '' // 总条数
  }

  template.defaults.imports.formDate = function (value) {
    const d = moment(new Date(value))
    return d.format('YYYY-MM-DD HH:mm:ss')
  }

  template.defaults.imports.formURL = function (value) {
    return axios.defaults.baseURL + value
  }

  // 初始化文章分类列表
  initCateList()
  function initCateList() {
    axios.get('/my/cate/list').then((res) => {
      const { code, data } = res.data

      if (code !== 0) return layer.msg('获取文章分类列表失败')

      const html = template('js-tpl-atricle-all-cate', data)

      $('#js-atricle-all-cate').html(html)

      form.render('select')
    })
  }

  // 初始化文章列表
  renderAtricle()
  function renderAtricle() {
    axios
      .get('/my/article/list', {
        params: q
      })
      .then((res) => {
        const { code, data, total } = res.data
        if (code !== 0) return layer.msg('获取文章列表失败')

        layer.msg('获取文章列表成功')

        const html = template('js-tpl-tbody', data)

        $('#js-tbody').html(html)

        q.total = total
        renderPagition()
      })
  }

  function renderPagition() {
    let f = false
    // 分页
    laypage.render({
      elem: 'js-pagition',
      count: q.total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 5, 10, 15, 20],
      jump: function (obj, first) {
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if (f) {
          renderAtricle()
        }

        f = true
      }
    })
  }

  // 监听筛选表单的点击事件

  form.on('submit(form-filter)', function (data) {
    q.cate_id = data.field.cate_id
    q.state = data.field.state

    renderAtricle()
  })

  // 添加删除文章事件
  $('#js-tbody').on('click', '.js-btn-del-atr', function (e) {
    e.preventDefault()
    const id = this.dataset.id

    layer.confirm(
      '确认要删除此文章吗？',
      {
        title: '提示',
        icon: 3
      },
      function (index) {
        axios
          .delete('/my/article/info', {
            params: { id }
          })
          .then((res) => {
            const { code } = res.data

            if (code !== 0) return layer.msg('删除文章失败')

            layer.msg('删除文章成功')

            // 重新渲染文章列表
            renderAtricle()
          })

        layer.close(index)
      }
    )
  })

  // 获取文章详情

  $('#js-tbody').on('click', '.js-prview-atricle', function (e) {
    e.preventDefault()
    const id = this.dataset.id
    axios
      .get('/my/article/info', {
        params: {
          id
        }
      })
      .then((res) => {
        const { code, data } = res.data

        if (code !== 0) return layer.msg('获取文章详情失败')

        layer.open({
          title: '预览文章',
          area: ['85%', '85%'],
          type: 1,
          content: template('js-tpl-prveiw-atricle', data)
        })
      })
  })
})
