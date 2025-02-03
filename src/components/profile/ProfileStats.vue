<template>
  <div class="bg-white shadow mt-4">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <dl class="grid grid-cols-3 gap-4">
        <div class="px-4 py-2 text-center">
          <dt class="text-sm font-medium text-gray-500">Projets</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">{{ stats.projects }}</dd>
        </div>
        <div class="px-4 py-2 text-center">
          <dt class="text-sm font-medium text-gray-500">Tutoriels</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">{{ stats.tutorials }}</dd>
        </div>
        <div class="px-4 py-2 text-center">
          <dt class="text-sm font-medium text-gray-500">Ressources</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">{{ stats.resources }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      projects: 0,
      tutorials: 0,
      resources: 0
    })
  }
})
</script>
