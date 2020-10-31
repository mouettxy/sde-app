import { authModule } from './../store/index'
import Vue from 'vue'
import Router, { NavigationGuardNext, Route } from 'vue-router'
import routes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'
import NProgress from '@/plugins/progress-bar'
import { ability } from '@/plugins/casl'

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

function routerCheck(to: Route, from: Route, next: NavigationGuardNext<Vue>) {
  const isPageRequiresAuth = to.meta.requiresAuth
  const isLoggedIn = authModule.isLoggedIn
  const canNavigate = to.matched.some((route: any) => {
    return ability.can(route.meta.action || 'read', route.meta.resource)
  })
  const toAuth = to.name === 'login'

  if (toAuth && !isLoggedIn) {
    next()
    return
  }

  if (isPageRequiresAuth && !isLoggedIn) {
    next({ name: 'login' })
    return
  } else if (toAuth && isLoggedIn) {
    next({ name: 'index' })
  }

  if (canNavigate) {
    next()
    return
  }

  next()
}

router.beforeEach(routerCheck)

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

export default router
