<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <NavBar />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </router-view>
    </main>
    <FooterSection />
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue'
import FooterSection from './components/FooterSection.vue'

const authStore = useAuthStore()
authStore.initialize()

</script>
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
