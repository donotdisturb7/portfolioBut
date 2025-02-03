<template>
  <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
    <div class="relative h-48">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="project.titre"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
        <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <div class="p-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">{{ project.titre }}</h3>
        <span 
          class="px-2 py-1 text-xs font-medium rounded"
          :class="typeClasses"
        >
          {{ project.type }}
        </span>
      </div>
      <p class="mt-2 text-sm text-gray-600">{{ project.description }}</p>

      <!-- Créateur du projet -->
      <div class="mt-4">
        <p class="text-sm text-gray-600">
          Créé par <span class="font-medium">{{ project.owner?.prenom }} {{ project.owner?.nom }}</span>
        </p>
      </div>

      <div v-if="project.collaborateurs?.length > 0" class="mt-4">
        <h4 class="text-sm font-medium text-gray-700">Collaborateurs :</h4>
        <div class="mt-2 flex flex-wrap gap-2">
          <div 
            v-for="collab in project.collaborateurs" 
            :key="collab.id"
            class="inline-flex items-center px-2 py-1 rounded-full bg-gray-100"
          >
            <span class="text-sm text-gray-600">{{ collab.prenom }} {{ collab.nom }}</span>
          </div>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="flex space-x-4">
          <a
            v-if="project.lienGithub"
            :href="project.lienGithub"
            target="_blank"
            class="text-gray-600 hover:text-gray-900"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            v-if="project.lienDemo"
            :href="project.lienDemo"
            target="_blank"
            class="text-gray-600 hover:text-gray-900"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        <span class="text-sm text-gray-500">
          {{ formatDate(project.dateCreation) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const typeClasses = computed(() => ({
  'bg-blue-100 text-blue-800': props.project.type === 'web',
  'bg-purple-100 text-purple-800': props.project.type === 'jeuxvideo',
  'bg-green-100 text-green-800': props.project.type === 'desktop',
  'bg-yellow-100 text-yellow-800': props.project.type === 'mobile',
  'bg-red-100 text-red-800': props.project.type === 'ia',
  'bg-indigo-100 text-indigo-800': props.project.type === 'cybersecurite'
}))

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>