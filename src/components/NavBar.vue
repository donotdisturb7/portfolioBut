<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo et Navigation -->
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-gray-800">Portfolio BUT</router-link>
          </div>

          <!-- Liens de Navigation -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-blue-500 text-gray-900': $route.path === '/' }"
            >
              Home
            </router-link>

            <router-link
              to="/projets"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-blue-500 text-gray-900': $route.path.startsWith('/projets') }"
            >
              Projets
            </router-link>

            <router-link
              to="/tutoriels"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-blue-500 text-gray-900': $route.path.startsWith('/tutoriels') }"
            >
              Tutoriels
            </router-link>
          </div>
        </div>

        <!-- Barre de recherche -->
        <div class="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
          <div class="max-w-lg w-full lg:max-w-xs">
            <label for="search" class="sr-only">Rechercher</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                v-model="searchQuery"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Rechercher..."
                type="search"
                @keyup.enter="handleSearch"
              >
            </div>
          </div>
        </div>

        <!-- Menu Utilisateur -->
        <div v-if="authStore.estAuthentifie" class="hidden sm:ml-6 sm:flex sm:items-center">
          <!-- Bouton Notifications -->
          <button class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span class="sr-only">Voir les notifications</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <!-- Menu Profil -->
          <div class="ml-3 relative">
            <div>
              <button
                @click="isProfileMenuOpen = !isProfileMenuOpen"
                class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
              >
                <img
                  :src="authStore.profil?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + authStore.profil?.prenom"
                  :alt="authStore.profil?.prenom"
                  class="h-8 w-8 rounded-full"
                >
                <span class="ml-2 font-medium text-gray-700">{{ authStore.profil?.prenom }}</span>
              </button>
            </div>

            <!-- Menu déroulant -->
            <div
              v-if="isProfileMenuOpen"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
              role="menu"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Mon Profil
              </router-link>
              <router-link
                to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Paramètres
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>

        <!-- Boutons Connexion/Inscription si non connecté -->
        <div v-else class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
          <router-link
            to="/login"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Connexion
          </router-link>
          <router-link
            to="/register"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            S'inscrire
          </router-link>
        </div>

        <!-- Bouton Menu Mobile -->
        <div class="flex items-center sm:hidden">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span class="sr-only">Ouvrir le menu</span>
            <svg
              :class="{'hidden': isMobileMenuOpen, 'block': !isMobileMenuOpen }"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              :class="{'block': isMobileMenuOpen, 'hidden': !isMobileMenuOpen }"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div :class="{'block': isMobileMenuOpen, 'hidden': !isMobileMenuOpen}" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[
            $route.path === '/'
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
          ]"
        >
          Home
        </router-link>
        <router-link
          to="/projets"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[
            $route.path.startsWith('/projets')
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
          ]"
        >
          Projets
        </router-link>
        <router-link
          to="/tutoriels"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[
            $route.path.startsWith('/tutoriels')
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
          ]"
        >
          Tutoriels
        </router-link>
      </div>

      <!-- Menu Mobile Profil -->
      <div v-if="authStore.estAuthentifie" class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <img
              :src="authStore.profil?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + authStore.profil?.prenom"
              :alt="authStore.profil?.prenom"
              class="h-10 w-10 rounded-full"
            >
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ authStore.profil?.prenom }} {{ authStore.profil?.nom }}</div>
            <div class="text-sm font-medium text-gray-500">{{ authStore.profil?.email }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <router-link
            to="/profile"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Mon Profil
          </router-link>
 
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      <!-- Menu Mobile Connexion/Inscription -->
      <div v-else class="pt-4 pb-3 border-t border-gray-200">
        <div class="space-y-1">
          <router-link
            to="/login"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Connexion
          </router-link>
          <router-link
            to="/register"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            S'inscrire
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const isProfileMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)

const handleSearch = () => {
  // TODO: Implémenter la recherche
  console.log('Recherche:', searchQuery.value)
}

const handleLogout = async () => {
  try {
    await authStore.deconnexion()
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>
