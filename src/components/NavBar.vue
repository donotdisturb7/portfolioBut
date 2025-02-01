<template>
  <nav v-if="!isAuthPage" class="relative px-8 py-4 flex justify-between items-center bg-white">
    <router-link to="/" class="text-3xl font-bold leading-none">
      <h2 class="h-10">Portfolio BUT</h2>
    </router-link>

    <div class="lg:hidden">
      <button class="navbar-burger flex items-center text-gray-600 p-3" @click="toggleMobileMenu">
        <svg class="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Mobile menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </button>
    </div>

    <ul class="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-6">
      <li>
        <router-link 
          to="/" 
          class="text-sm text-gray-600 hover:text-gray-500"
          :class="{ 'text-blue-600 font-medium': route.path === '/' }"
          @click="closeMenus"
        >
          Accueil
        </router-link>
      </li>
      <li class="text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" class="w-4 h-4 current-fill" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </li>
      <li>
        <router-link 
          to="/projets" 
          class="text-sm text-gray-600 hover:text-gray-500"
          :class="{ 'text-blue-600 font-medium': route.path === '/projets' }"
          @click="closeMenus"
        >
          Projets
        </router-link>
      </li>
      <li class="text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" class="w-4 h-4 current-fill" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </li>
      <li>
        <router-link 
          to="/tutoriels" 
          class="text-sm text-gray-600 hover:text-gray-500"
          :class="{ 'text-blue-600 font-medium': route.path === '/tutoriels' }"
          @click="closeMenus"
        >
          Tutoriels
        </router-link>
      </li>
      <li class="text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" class="w-4 h-4 current-fill" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </li>
      <li>
        <router-link 
          to="/ressources" 
          class="text-sm text-gray-600 hover:text-gray-500"
          :class="{ 'text-blue-600 font-medium': route.path === '/ressources' }"
          @click="closeMenus"
        >
          Ressources
        </router-link>
      </li>
    </ul>

    <!-- Menu utilisateur pour desktop -->
    <div class="hidden lg:flex lg:items-center">
      <div v-if="!authStore.isAuthenticated" class="flex space-x-4">
        <router-link to="/login" 
          class="block px-5 py-2 text-sm font-medium tracking-wider text-center text-white transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-600">
          Connexion
        </router-link>
        <router-link to="/register"
          class="block px-5 py-2 text-sm font-medium tracking-wider text-center text-gray-700 transition-colors duration-300 transform bg-gray-200 rounded-md lg:mx-4 hover:bg-gray-300200">
          S'inscrire
        </router-link>
      </div>
      <div v-else class="relative profile-menu">
        <button
          @click.stop="isProfileMenuOpen = !isProfileMenuOpen"
          class="flex items-center space-x-2 text-gray-600 focus:outline-none"
        >
          <img
            :src="authStore.profile?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + authStore.profile?.prenom"
            :alt="authStore.profile?.prenom"
            class="h-8 w-8 rounded-full"
          >
          <span class="text-sm font-medium">{{ authStore.profile?.prenom }}</span>
        </button>

        <!-- Menu déroulant profil -->
        <div
          v-show="isProfileMenuOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
        >
          <router-link
            to="/profile"
            @click="isProfileMenuOpen = false"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Mon Profil
          </router-link>
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Menu Mobile -->
  <div :class="['navbar-menu', 'relative', 'z-50', { 'hidden': !isMobileMenuOpen }]">
    <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
    <nav class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
      <div class="flex items-center mb-8">
        <router-link to="/" class="mr-auto text-3xl font-bold leading-none">
          <h2 class="h-10">Portfolio BUT</h2>
        </router-link>
        <button class="navbar-close" @click="toggleMobileMenu">
          <svg class="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Profil mobile -->
      <div v-if="authStore.isAuthenticated" class="mb-8">
        <div class="flex items-center">
          <img
            :src="authStore.profile?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + authStore.profile?.prenom"
            :alt="authStore.profile?.prenom"
            class="h-10 w-10 rounded-full"
          >
          <div class="ml-3">
            <div class="text-sm font-medium text-gray-800">{{ authStore.profile?.prenom }} {{ authStore.profile?.nom }}</div>
            <div class="text-xs text-gray-500">{{ authStore.profile?.email }}</div>
          </div>
        </div>
      </div>

      <!-- Navigation mobile -->
      <div>
        <ul>
          <li class="mb-1">
            <router-link to="/" class="block p-4 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded" @click="closeMenus">Accueil</router-link>
          </li>
          <li class="mb-1">
            <router-link to="/projets" class="block p-4 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded" @click="closeMenus">Projets</router-link>
          </li>
          <li class="mb-1">
            <router-link to="/tutoriels" class="block p-4 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded" @click="closeMenus">Tutoriels</router-link>
          </li>
          <li class="mb-1">
            <router-link to="/ressources" class="block p-4 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded" @click="closeMenus">Ressources</router-link>
          </li>
        </ul>
      </div>

      <!-- Actions mobile -->
      <div class="mt-auto">
        <div class="pt-6">
          <div v-if="!authStore.isAuthenticated">
            <router-link to="/login"
              class="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-l-xl rounded-t-xl"
            >
              Connexion
            </router-link>
            <router-link to="/register"
              class="block px-4 py-3 mb-2 leading-loose text-xs text-center font-semibold bg-gray-50 hover:bg-gray-100 rounded-l-xl rounded-t-xl"
            >
              S'inscrire
            </router-link>
          </div>
          <div v-else>
            <router-link to="/profile"
              class="block px-4 py-3 mb-2 leading-loose text-xs text-center text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-l-xl rounded-t-xl"
            >
              Mon Profil
            </router-link>
            <button @click="handleLogout"
              class="block w-full px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-l-xl rounded-t-xl"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)

const isAuthPage = computed(() => {
  return ['/login', '/register'].includes(route.path)
})

const closeMenus = async () => {
  isProfileMenuOpen.value = false
  isMobileMenuOpen.value = false
  // Attendre que la navigation soit terminée
  await nextTick()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    isProfileMenuOpen.value = false
  }
}

// Fermer le menu profil quand on clique ailleurs
const closeProfileMenu = (e) => {
  if (!e.target.closest('.profile-menu')) {
    isProfileMenuOpen.value = false
  }
}

// Ajouter l'écouteur d'événements au montage du composant
onMounted(() => {
  document.addEventListener('click', closeProfileMenu)
})

// Nettoyer l'écouteur d'événements à la destruction du composant
onUnmounted(() => {
  document.removeEventListener('click', closeProfileMenu)
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    await closeMenus()
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>
