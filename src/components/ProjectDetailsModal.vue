<!--quand on clique sur un projet, on affiche le modal avec plus d'infos -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '~/firebase/config'

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'project-deleted'])
const authStore = useAuthStore()
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const closeModal = () => {
  showDeleteConfirm.value = false
  emit('close')
}

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.addEventListener('keydown', handleEscape)
})

const deleteProject = async () => {
  try {
    isDeleting.value = true
    await deleteDoc(doc(db, 'projects', props.project.id))
    emit('project-deleted', props.project.id)
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error)
  } finally {
    isDeleting.value = false
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
    <div v-if="show" class="modal-base" @click="closeModal">
      <!-- Overlay avec effet de flou -->
      <div class="modal-overlay"></div>

      <!-- Contenu du modal -->
      <div class="modal-content max-w-4xl" @click.stop>
        <!-- En-tête -->
        <div class="relative bg-[--primary] text-white p-6 rounded-t-2xl">
          <h2 class="text-2xl font-bold">{{ project.title }}</h2>
          <p class="mt-2 opacity-90">Par {{ project.authorPrenom }} {{ project.authorNom }}</p>

          <!-- Bouton de fermeture -->
          <button @click="closeModal"
                  class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Corps -->
        <div class="p-6 space-y-6">
          <!-- Description -->
          <div class="prose max-w-none">
            <p>{{ project.description }}</p>
          </div>

          <!-- Catégorie -->
          <div>
            <h3 class="text-lg font-semibold mb-2">Catégorie</h3>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[--primary] text-white">
              {{ project.category }}
            </span>
          </div>

          <!-- Technologies -->
          <div>
            <h3 class="text-lg font-semibold mb-2">Technologies utilisées</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in project.technologies" 
                    :key="tech"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Liens -->
          <div class="flex gap-4">
            <a v-if="project.githubUrl"
               :href="project.githubUrl"
               target="_blank"
               class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              GitHub
            </a>
            <a v-if="project.demoUrl"
               :href="project.demoUrl"
               target="_blank"
               class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Voir la démo
            </a>
          </div>
        </div>

        <!-- Pied de modal -->
        <div v-if="authStore.utilisateur && authStore.utilisateur.uid === project.authorId" 
             class="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <div class="flex justify-end">
            <button v-if="!showDeleteConfirm"
                    @click="showDeleteConfirm = true"
                    class="text-red-600 hover:text-red-700 font-medium">
              Supprimer le projet
            </button>
            <div v-else class="flex items-center gap-4">
              <span class="text-sm text-gray-600">Êtes-vous sûr de vouloir supprimer ce projet ?</span>
              <button @click="showDeleteConfirm = false"
                      class="text-gray-600 hover:text-gray-700 font-medium">
                Annuler
              </button>
              <button @click="deleteProject"
                      :disabled="isDeleting"
                      class="text-red-600 hover:text-red-700 font-medium disabled:opacity-50">
                {{ isDeleting ? 'Suppression...' : 'Confirmer' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>