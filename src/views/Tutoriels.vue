<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Tutoriels</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="tutoriel in tutoriels" :key="tutoriel.id" 
           class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative pb-[56.25%]">
          <iframe 
            v-if="tutoriel.video_url"
            :src="tutoriel.video_url"
            class="absolute top-0 left-0 w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <img 
            v-else
            :src="tutoriel.image_url" 
            :alt="tutoriel.titre"
            class="absolute top-0 left-0 w-full h-full object-cover"
          >
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ tutoriel.titre }}</h3>
          <p class="text-gray-600 mb-4">{{ tutoriel.description }}</p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>Par: {{ tutoriel.auteur }}</span>
            <span>Niveau: {{ tutoriel.niveau }}</span>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ tutoriel.duree }} minutes</span>
            <a :href="tutoriel.url" 
               class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
              Voir le tutoriel
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/config/supabase'

const tutoriels = ref([])

onMounted(async () => {
  // Fetch tutorials
  const { data, error } = await supabase
    .from('tutoriels')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors du chargement des tutoriels:', error)
    return
  }

  tutoriels.value = data
})
</script>
