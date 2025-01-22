<template>
  <nav class="bg-white shadow-md w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="text-xl font-bold text-gray-800">
          BUT Informatique
        </router-link>
        <div class="hidden md:flex space-x-6">
          <router-link v-for="link in navLinks" 
                      :key="link.to" 
                      :to="link.to"
                      class="text-gray-600 hover:text-gray-900">
            {{ link.text }}
          </router-link>
        </div>
        <button class="md:hidden p-2" @click="mobileMenuOpen = !mobileMenuOpen">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <div v-if="mobileMenuOpen" class="md:hidden py-4">
        <router-link v-for="link in navLinks" 
                    :key="link.to" 
                    :to="link.to"
                    @click="mobileMenuOpen = false"
                    class="block py-2 text-gray-600 hover:text-gray-900">
          {{ link.text }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', text: 'Accueil' },
  { to: '/portfolio', text: 'Projets' },
  { to: '/resources', text: 'Ressources' }
]
</script>
