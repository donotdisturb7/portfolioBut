<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '~/firebase/config'

const emit = defineEmits(['close', 'project-added'])
const authStore = useAuthStore()

const project = ref({
  title: '',
  description: '',
  category: '',
  technologies: [],
  githubUrl: '',
  demoUrl: ''
})

const newTechnology = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const addTechnology = () => {
  if (newTechnology.value && !project.value.technologies.includes(newTechnology.value)) {
    project.value.technologies.push(newTechnology.value)
    newTechnology.value = ''
  }
}

const removeTechnology = (tech) => {
  project.value.technologies = project.value.technologies.filter(t => t !== tech)
}

const createProject = async () => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''

    const user = authStore.utilisateur
    if (!user) {
      throw new Error('Vous devez être connecté pour créer un projet')
    }

    const projectData = {
      title: project.value.title,
      description: project.value.description,
      category: project.value.category,
      technologies: project.value.technologies,
      githubUrl: project.value.githubUrl || null,
      demoUrl: project.value.demoUrl || null,
      createdAt: new Date().toISOString(),
      authorId: user.uid,
      authorPrenom: user.prenom || '',
      authorNom: user.nom || '',
      authorPhotoURL: user.photoURL || null,
      authorPromotion: user.promotion || ''
    }

    const docRef = await addDoc(collection(db, 'projects'), projectData)
    emit('project-added', { id: docRef.id, ...projectData })
    emit('close')
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error)
    errorMessage.value = 'Une erreur est survenue lors de la création du projet.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div class="modal-base">
      <!-- Overlay avec effet de flou -->
      <div class="modal-overlay" @click="$emit('close')"></div>

      <!-- Contenu du modal -->
      <div class="modal-content">
        <!-- En-tête -->
        <div class="relative bg-[--primary] text-white p-6 rounded-t-2xl">
          <h2 class="text-2xl font-bold">Ajouter un nouveau projet</h2>
          <p class="mt-2 opacity-90">Partagez votre projet avec la communauté</p>
          
          <!-- Bouton de fermeture -->
          <button @click="$emit('close')"
                  class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="createProject" class="p-6 space-y-6">
          <!-- Message d'erreur -->
          <div v-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-lg">
            {{ errorMessage }}
          </div>

          <!-- Titre -->
          <div class="space-y-2">
            <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
            <input type="text" id="title" v-model="project.title" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent">
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" v-model="project.description" rows="4" required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent"></textarea>
          </div>

          <!-- Catégorie -->
          <div class="space-y-2">
            <label for="category" class="block text-sm font-medium text-gray-700">Catégorie</label>
            <select id="category" v-model="project.category" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent">
              <option value="">Sélectionner une catégorie</option>
              <option value="Web">Web</option>
              <option value="Mobile">Mobile</option>
              <option value="Desktop">Desktop</option>
              <option value="Intelligence Artificielle">Intelligence Artificielle</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <!-- Technologies -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Technologies</label>
            <div class="flex gap-2">
              <input type="text" v-model="newTechnology" placeholder="Ajouter une technologie"
                     class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                     @keyup.enter.prevent="addTechnology">
              <button type="button" @click="addTechnology"
                      class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Ajouter
              </button>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="tech in project.technologies" 
                    :key="tech"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                {{ tech }}
                <button type="button" @click="removeTechnology(tech)" class="ml-2 text-gray-500 hover:text-gray-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          </div>

          <!-- URLs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="githubUrl" class="block text-sm font-medium text-gray-700">URL GitHub</label>
              <input type="url" id="githubUrl" v-model="project.githubUrl"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent">
            </div>
            <div class="space-y-2">
              <label for="demoUrl" class="block text-sm font-medium text-gray-700">URL Démo</label>
              <input type="url" id="demoUrl" v-model="project.demoUrl"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--primary] focus:border-transparent">
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end gap-4 pt-4">
            <button type="button" @click="$emit('close')"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit"
                    :disabled="isSubmitting"
                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isSubmitting">Création en cours...</span>
              <span v-else>Créer le projet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>