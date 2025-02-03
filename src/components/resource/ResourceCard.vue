<template>
  <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
    <div class="relative h-48">
      <img
        v-if="resource.image"
        :src="resource.image"
        :alt="resource.titre"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
        <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
    </div>

    <div class="p-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">{{ resource.titre }}</h3>
        <span 
          class="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800"
        >
          {{ resource.type }}
        </span>
      </div>
      <p class="mt-2 text-sm text-gray-600">{{ resource.description }}</p>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="(tag, index) in resource.tags"
          :key="index"
          class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
        >
          {{ tag }}
        </span>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="flex space-x-4">
          <a
            v-if="resource.lien"
            :href="resource.lien"
            target="_blank"
            class="text-gray-600 hover:text-gray-900"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button 
            v-if="canDelete"
            @click="$emit('delete', resource)"
            class="text-red-600 hover:text-red-900"
            title="Supprimer la ressource"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <span class="text-sm text-gray-500">
          {{ formatDate(resource.dateCreation) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resource: {
    type: Object,
    required: true
  },
  canDelete: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete'])

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
