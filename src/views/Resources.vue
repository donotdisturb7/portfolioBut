<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Ressources d'apprentissage</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="resource in resources" :key="resource.id" 
           class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-green-500 text-white px-4 py-2 font-semibold">
          {{ resource.type }}
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ resource.title }}</h3>
          <p class="text-gray-600 mb-4">{{ resource.description }}</p>
          <div class="flex justify-between text-sm text-gray-500 mb-4">
            <span>Ajouté par: {{ resource.author }}</span>
            <span>Niveau: {{ resource.level }}</span>
          </div>
          <a :href="resource.url" target="_blank" rel="noopener" 
             class="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
            Accéder au Ressource
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/config/supabase'

const resources = ref([])

onMounted(async () => {
  // Fetch resources
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching resources:', error)
    return
  }

  resources.value = data
})
</script>

