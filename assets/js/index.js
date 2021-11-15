// 定义初始化用户信息的模块
define('initUserInfo', ['axios', 'layui'], function (axios, { layer, $ }) {
  // 定义渲染用户基本信息函数
  const renderUserInfo = function (data) {
    const name = data.nickname || data.username
    // 有图片头像，显示图片头像
    if (data.user_pic) {
      $('.js-avatar-img').attr('src', data.user_pic).show()
      $('.js-avatar-text').hide()
    }

    // 没有图片头像，显示文本头像
    else {
      $('.js-avatar-text').text(name[0].toUpperCase()).show()
      $('.js-avatar-img').hide()
    }

    // 设置欢迎文本
    $('#js-welcome-text').html('欢迎&nbsp;&nbsp;' + name + '回来')
  }

  return function initUserInfo() {
    axios.get('/my/userinfo').then((res) => {
      const { code, data } = res.data
      if (code !== 0) return layer.msg('获取用户基本信息失败')

      // 渲染用户基本信息
      renderUserInfo(data)
    })
  }
})

require([
  'layui',
  'axios',
  'template',
  'goLoginPage',
  'initUserInfo'
], function ({ layer, element }, axios, tpl, goLoginPage, initUserInfo) {
  // 定义icon过滤器
  tpl.defaults.imports.reicon = function (value) {
    return {
      'el-icon-s-home': 'icon-home',
      'el-icon-s-order': 'icon-16',
      'el-icon-user-solid': 'icon-user'
    }[value]
  }

  // 退出登录选项
  $('#js-logout').click(function (e) {
    e.preventDefault()
    layer.confirm(
      '确定要退出登录吗?',
      { icon: 3, title: '提示' },

      // 点击确认按钮执行回调
      function (index) {
        // 退回到登录页
        goLoginPage()
        layer.close(index)
      }
    )
  })

  // 初始化左侧菜单
  initSideMenu()
  // 初始化用户基本信息
  initUserInfo()
  function initSideMenu() {
    axios.get('/my/menus').then((res) => {
      const { data, code } = res.data
      if (code !== 0) return layer.msg('初始化左侧菜单失败')

      const html = tpl('js-tpl-side-menu', data)

      $('#js-side-menu').html(html)

      element.render('nav', 'side-menu')
    })
  }
})
