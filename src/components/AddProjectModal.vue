<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 class="text-2xl font-bold mb-4">Ajouter un nouveau projet</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="type" class="block text-sm font-medium text-gray-700">Type du projet</label>
            <select v-model="type" id="type" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="web">Web</option>
              <option value="app">App</option>
              <option value="ia">IA</option>
              <!-- Ajoutez d'autres options ici -->
            </select>
          </div>
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
            <input v-model="title" type="text" id="title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Description du projet</label>
            <textarea v-model="description" id="description" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required></textarea>
          </div>
          <div class="mb-4">
            <label for="technologies" class="block text-sm font-medium text-gray-700">Technologies utilisées</label>
            <div class="flex items-center">
              <input v-model="technologyInput" type="text" id="technologies" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <button type="button" @click="addTechnology" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md">+</button>
            </div>
            <div class="flex flex-wrap mt-2">
              <span v-for="(tech, index) in technologies" :key="index" class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                {{ tech }}
                <button type="button" @click="removeTechnology(index)" class="ml-2 text-red-500">x</button>
              </span>
            </div>
          </div>
          <div class="mb-4">
            <label for="github_url" class="block text-sm font-medium text-gray-700">Lien GitHub</label>
            <input v-model="github_url" type="url" id="github_url" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div class="mb-4">
            <label for="project_url" class="block text-sm font-medium text-gray-700">Lien du projet</label>
            <input v-model="project_url" type="url" id="project_url" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div class="flex justify-end">
            <button type="button" @click="closeModal" class="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">Annuler</button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  
  // Définir les événements émis par le composant
  const emit = defineEmits(['add-project', 'close'])
  
  const show = ref(true)
  const type = ref('')
  const title = ref('')
  const description = ref('')
  const technologies = ref([])
  const technologyInput = ref('')
  const github_url = ref('')
  const project_url = ref('')
  const authStore = useAuthStore()
  
  const addTechnology = () => {
    if (technologyInput.value) {
      technologies.value.push(technologyInput.value)
      technologyInput.value = ''
    }
  }
  
  const removeTechnology = (index) => {
    technologies.value.splice(index, 1)
  }
  
  const closeModal = () => {
    show.value = false
    emit('close')
  }
  
  const handleSubmit = () => {
    const projectData = {
      type: type.value,
      title: title.value,
      description: description.value,
      technologies: technologies.value,
      github_url: github_url.value,
      project_url: project_url.value,
      student_name: authStore.fullName
    }
    // Emit event to parent component
    emit('add-project', projectData)
    closeModal()
  }
  
  // Watch the show prop to reset the form when the modal is opened
  watch(show, (newVal) => {
    if (newVal) {
      type.value = ''
      title.value = ''
      description.value = ''
      technologies.value = []
      technologyInput.value = ''
      github_url.value = ''
      project_url.value = ''
    }
  })
  </script>