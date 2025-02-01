import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/config/supabase'

// Définition des routes de l'application
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue')
  },
  {
    path: '/projets',
    name: 'Projets',
    component: () => import('@/views/Projects.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tutoriels',
    name: 'Tutoriels',
    component: () => import('@/views/Tutoriels.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ressources',
    name: 'Ressources',
    component: () => import('@/views/Resources.vue'),
    meta: { requiresAuth: true }
  }, 
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/auth/Profile.vue'),
    meta: { requiresAuth: true }
  }
]

// Création du routeur avec l'historique web
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard pour vérifier l'authentification
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (to.meta.requiresAuth && !session) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    next('/login')
  } else {
    next()
  }
})

export default router
