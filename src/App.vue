<script setup>
import { ref } from 'vue'
import Navbar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'

const mobileMenuOpen = ref(false)


</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar v-if="!$route.meta.hideNavbar" />
    <main class="w-full flex-grow">
      <router-view></router-view>
    </main>
    <FooterSection v-if="!$route.meta.hideNavbar" />
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
