import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/config/supabase'

// Routes pour l'authentification
const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Profile.vue'),
    meta: { requiresAuth: true }
  }
]

// Routes protégées
const protectedRoutes = [
  {
    path: '/projets',
    name: 'Projets',
    component: () => import(/* webpackChunkName: "main" */ '@/views/Projects.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tutoriels',
    name: 'Tutoriels',
    component: () => import(/* webpackChunkName: "main" */ '@/views/Tutoriels.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ressources',
    name: 'Ressources',
    component: () => import(/* webpackChunkName: "main" */ '@/views/Resources.vue'),
    meta: { requiresAuth: true }
  }
]

// Routes publiques
const publicRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "main" */ '@/views/Home.vue')
  }
]

// Toutes les routes combinées
const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...protectedRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "error" */ '@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard avec gestion des erreurs
router.beforeEach(async (to, from, next) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Erreur d\'authentification:', error)
      next('/login')
      return
    }

    // Redirection pour les routes protégées
    if (to.meta.requiresAuth && !session) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    // Redirection pour les routes invités
    if (to.meta.requiresGuest && session) {
      next({ name: 'Home' })
      return
    }

    next()
  } catch (error) {
    console.error('Erreur inattendue:', error)
    next('/login')
  }
})

export default router
