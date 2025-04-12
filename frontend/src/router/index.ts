import { createRouter, createWebHistory } from 'vue-router'
import GestionProductos from '../views/GestionProductos.vue'
import Tienda from '../views/Tienda.vue'
import Login from '../views/Login.vue'
import { useAuthStore } from '../stores/useAuthStore'
import { jwtDecode } from 'jwt-decode'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Tienda,
    },
    {
      path: '/gestion_productos',
      name: 'GestionProductos',
      component: GestionProductos,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const token = authStore.token

  if (to.meta.requiresAuth) {
    if (!token) {
      return next({ name: 'login' })
    }

    try {
      const decoded: JwtPayload = jwtDecode(token)
      const isExpired = decoded.exp * 1000 < Date.now()

      if (isExpired) {
        console.warn('Token expirado')
        authStore.logOut()
        return next({ name: 'login' })
      }

      return next()
    } catch (err) {
      console.error('Token inválido', err)
      authStore.logOut()
      return next({ name: 'login' })
    }
  } else {
    return next()
  }
})

export default router
