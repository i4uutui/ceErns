const myRouter = {
  path: '/',
  name: 'layout',
  component: () => import('../views/layout.jsx'),
  redirect: '/menber',
  children: [
    {
      path: '/menber',
      name: 'MenberUser',
      meta:{
        title: '系统管理'
      },
      component: () => import('../views/menber/user.jsx')
    }
  ]
}

export { myRouter }