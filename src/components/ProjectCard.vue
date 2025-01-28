<!-- les cartes des projets -->
<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])
</script>

<template>
  <div @click="$emit('click')" 
       class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100">
    <!-- En-tête avec catégorie et date -->
    <div class="p-6">
      <!-- Catégorie -->
      <div class="flex items-center justify-between mb-4">
        <span class="px-3 py-1 text-sm font-medium bg-[--primary] text-white rounded-full">
          {{ project.category }}
        </span>
      </div>

      <!-- Titre et description -->
      <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-[--primary] transition-colors">
        {{ project.title }}
      </h3>
      <p class="text-gray-600 line-clamp-2">
        {{ project.description }}
      </p>

      <!-- Technologies -->
      <div class="mt-4 flex flex-wrap gap-2">
        <span v-for="tech in project.technologies.slice(0, 3)" 
              :key="tech"
              class="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
          {{ tech }}
        </span>
        <span v-if="project.technologies.length > 3" 
              class="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
          +{{ project.technologies.length - 3 }}
        </span>
      </div>

      <!-- Auteur -->
      <div class="mt-6 flex items-center">
        <img :src="project.authorPhotoURL || '/default-avatar.png'"
             :alt="project.authorPrenom"
             class="w-8 h-8 rounded-full object-cover">
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">
            {{ project.authorPrenom }} {{ project.authorNom }}
          </p>
          <p class="text-xs text-gray-500">
            {{ project.authorPromotion || 'Étudiant' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>