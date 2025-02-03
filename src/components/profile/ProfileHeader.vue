<template>
  <div class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ profile.prenom }} {{ profile.nom }}
      </h1>
    </div>
  </div>
</template>

<script setup>
import { supabase } from '@/supabase'

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})
</script>
