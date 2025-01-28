import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Profile from '../views/auth/Profile.vue'
import Projects from '../views/Projects.vue'
import Tutoriels from '../views/Tutoriels.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Projets',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/Tutoriels',
    name: 'Tutoriels',
    component: Tutoriels
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresGuest: true, hideNavbar: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresGuest: true, hideNavbar: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true, hideNavbar: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const isAuthenticated = auth.currentUser

  if (requiresGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
