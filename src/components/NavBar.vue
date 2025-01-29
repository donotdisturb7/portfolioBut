<template >
  <nav class="bg-white shadow dark:bg-gray-800" :class="{ 'simplified': isAuthPage }">
    <div class="container px-6 py-4 mx-auto">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex items-center justify-between">
          <router-link to="/" class="text-2xl font-bold text-gray-800 transition-colors duration-300 transform dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300">
            Portfolio BUT Info
          </router-link>
        </div>

        <!-- Menu normal (caché sur les pages auth) -->
        <template v-if="!isAuthPage">
          <div class="flex items-center">
            <router-link to="/projets" class="mx-4 text-gray-600 hover:text-gray-800">Projets</router-link>
            <router-link to="/tutoriels" class="mx-4 text-gray-600 hover:text-gray-800">Tutoriels</router-link>
            <router-link to="/ressources" class="mx-4 text-gray-600 hover:text-gray-800">Ressources</router-link>
            
            <!-- Menu utilisateur -->
            <div class="relative ml-4">
              <template v-if="authStore.isAuthenticated">
                <div class="relative" @click="menuOuvert = !menuOuvert">
                  <button class="flex items-center text-gray-700 focus:outline-none">
                    <span class="mr-2">{{ authStore.isStudent ? authStore.fullName : 'Visiteur' }}</span>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <!-- Menu déroulant -->
                  <div v-if="menuOuvert" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <router-link v-if="authStore.isStudent" to="/profile" class="block px-4 py-2 text-sm hover:bg-gray-100">
                      Mon Profil
                    </router-link>
                    <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </template>

              <template v-else>
                <router-link to="/login" class="mx-2 text-gray-600 hover:text-gray-800">Se connecter</router-link>
                <router-link to="/register" class="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  S'inscrire
                </router-link>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isAuthPage = computed(() => {
  return ['/login', '/register'].includes(route.path)
})

const menuOuvert = ref(false)

const handleLogout = async () => {
  try {
    await authStore.logout()
    menuOuvert.value = false
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>

<style scoped>
.simplified {
  background: transparent !important;
  position: absolute;
  width: 100%;
  z-index: 10;
}

.simplified a {
  color: white !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
