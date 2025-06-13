const myRouter = {
  path: '/',
  name: 'layout',
  component: () => import('../views/layout.jsx')
}

export { myRouter }