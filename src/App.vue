<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <Suspense>
          <template #default>
            <component :is="Component" />
          </template>
          <template #fallback>
            <div class="flex justify-center items-center h-full">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </template>
        </Suspense>
      </router-view>
    </main>
    <FooterSection/>
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
