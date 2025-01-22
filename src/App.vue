<script setup>
import { ref } from 'vue'
import Navbar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'

const mobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', text: 'Accueil' },
  { to: '/portfolio', text: 'Projets' },
  { to: '/resources', text: 'Ressources' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main class="w-full flex-grow">
      <router-view></router-view>
    </main>
    <FooterSection />
  </div>
</template>

<style>
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

body {
  margin: 0;
  min-height: 100vh;
}
</style>
