<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Image du tutoriel -->
    <div v-if="tutorial.image" class="relative h-48">
      <img
        :src="getImageUrl(tutorial.image)"
        :alt="tutorial.titre"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-6">
      <!-- Catégorie -->
      <p class="text-sm font-medium text-blue-600 uppercase tracking-wider">
        {{ tutorial.categorie }}
      </p>

      <!-- Titre et bouton de suppression -->
      <div class="flex justify-between items-start mt-2">
        <h3 class="text-xl font-semibold text-gray-900">
          {{ tutorial.titre }}
        </h3>
        <button
          v-if="canDelete"
          @click="$emit('delete', tutorial)"
          class="p-1 text-red-500 hover:text-red-600 transition-colors"
          title="Supprimer ce tutoriel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Date de création -->
      <p class="mt-2 text-sm text-gray-500">
        {{ new Date(tutorial.dateCreation).toLocaleDateString() }}
      </p>

      <!-- Contenu -->
      <div class="mt-4 prose prose-sm prose-blue">
        <div v-html="compiledMarkdown(tutorial.contenu)" class="line-clamp-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { supabase } from '@/supabase'
import { marked } from 'marked'

const props = defineProps({
  tutorial: {
    type: Object,
    required: true
  },
  canDelete: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete'])

const getImageUrl = (path) => {
  if (!path) return null
  return supabase.storage.from('images').getPublicUrl(path).data.publicUrl
}

const compiledMarkdown = (content) => {
  if (!content) return ''
  return marked(content)
}
</script>

<style>
.prose {
  max-width: none;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
