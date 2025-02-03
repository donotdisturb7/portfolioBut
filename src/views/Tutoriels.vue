<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Tutoriels</h1>
        <button
          v-if="user"
          @click="showAddTutorial = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un tutoriel
        </button>
      </div>

      <div class="flex py-4 overflow-x-auto overflow-y-hidden md:justify-center">
        <button
          v-for="category in categories"
          :key="category"
          :class="[
            'h-12 px-8 py-2 -mb-px text-sm text-center bg-transparent border-b-2 sm:text-base whitespace-nowrap focus:outline-none',
            selectedCategory === category
              ? 'text-blue-600 border-blue-500'
              : 'text-gray-700 border-gray-200 hover:border-gray-400'
          ]"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <div v-if="filteredTutorials.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun tutoriel dans cette catégorie</h3>
        <p class="mt-1 text-sm text-gray-500">
          Commencez par créer votre premier tutoriel.
        </p>
        <div class="mt-6">
          <button
            @click="showAddTutorial = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Créer un tutoriel
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        <TutorialCard
          v-for="tutorial in filteredTutorials"
          :key="tutorial.id"
          :tutorial="tutorial"
          :can-delete="user && tutorial.idUtilisateur === user.id"
          @delete="deleteTutorial"
        />
      </div>
    </div>

    <!-- Modal d'ajout de tutoriel -->
    <AddTutorialModal
      :show="showAddTutorial"
      @close="closeModal"
      @tutorial-added="addTutorial"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import AddTutorialModal from '@/components/tutorial/AddTutorialModal.vue'
import TutorialCard from '@/components/tutorial/TutorialCard.vue'

const authStore = useAuthStore()
const user = ref(null)
const tutorials = ref([])
const showAddTutorial = ref(false)
const selectedCategory = ref('Tous')
const categories = computed(() => {
  const uniqueCategories = new Set(tutorials.value.map(t => t.categorie))
  return ['Tous', ...Array.from(uniqueCategories)]
})

const filteredTutorials = computed(() => {
  if (selectedCategory.value === 'Tous') {
    return tutorials.value
  }
  return tutorials.value.filter(tutorial => tutorial.categorie === selectedCategory.value)
})

const fetchTutorials = async () => {
  try {
    const { data, error } = await supabase
      .from('tutoriels')
      .select('*')
      .order('dateCreation', { ascending: false })

    if (error) throw error

    tutorials.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des tutoriels:', error)
  }
}

const closeModal = () => {
  showAddTutorial.value = false
}

const addTutorial = async (tutorialData) => {
  await fetchTutorials()
  closeModal()
}

const deleteTutorial = async (tutorial) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce tutoriel ?')) {
    return
  }

  try {
    // Supprimer l'image si elle existe
    if (tutorial.image) {
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([tutorial.image])

      if (storageError) throw storageError
    }

    // Supprimer le tutoriel
    const { error } = await supabase
      .from('tutoriels')
      .delete()
      .eq('id', tutorial.id)

    if (error) throw error

    await fetchTutorials()
  } catch (error) {
    console.error('Erreur lors de la suppression du tutoriel:', error)
    alert('Erreur lors de la suppression du tutoriel')
  }
}

onMounted(async () => {
  user.value = authStore.user
  await fetchTutorials()
})
</script>

<style>
.prose {
  max-width: 65ch;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>