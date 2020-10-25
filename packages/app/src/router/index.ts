import { authModule } from './../store/index'
import Vue from 'vue'
import Router from 'vue-router'
import routes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'
import { includes } from 'lodash'
import NProgress from '@/plugins/progress-bar'

Vue.use(Router)

const RouterLayout = createRouterLayout((layout) => {
  return import('@/layouts/' + layout + '.vue')
})

const router = new Router({
  routes: [
    {
      path: '/',
      component: RouterLayout,
      children: routes,
    },
  ],
  mode: 'history',
})

export default router

router.beforeEach((to, from, next) => {
  const isLoggedIn = authModule.isLoggedIn

  const notAuthPages = ['login', 'index', 'order', 'client']

  if ((!isLoggedIn && includes(notAuthPages, to.name)) || isLoggedIn) {
    next()
    return
  } else {
    next({ name: 'login' })
    return
  }
})

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})
