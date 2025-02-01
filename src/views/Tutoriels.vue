<template>
  <section class="bg-white">
    <div class="container px-6 py-10 mx-auto">
      <h1 class="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">
        Tutoriels
        <button
          v-if="user"
          @click="handleButtonClick"
          class="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          Nouveau tutoriel
        </button>
      </h1>

      <div class="flex py-4 mt-4 overflow-x-auto overflow-y-hidden md:justify-center">
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

      <section class="mt-8 space-y-8 lg:mt-12">
        <div v-if="filteredTutorials.length === 0" class="text-center py-12 text-gray-500">
          Aucun tutoriel dans cette catégorie
        </div>

        <section v-for="tutorial in filteredTutorials" :key="tutorial.id" class="lg:flex lg:items-center mb-12">
          <div class="lg:w-1/2">
            <p class="text-lg tracking-wider text-blue-500 uppercase">{{ tutorial.categorie }}</p>
            <h2 class="mt-2 text-2xl font-semibold text-gray-800 capitalize">
              {{ tutorial.titre }}
              <!-- Bouton de suppression -->
              <button
                v-if="user && tutorial.idUtilisateur === user.id"
                @click="deleteTutorial(tutorial)"
                class="ml-2 p-1 text-red-500 hover:text-red-600 transition-colors"
                title="Supprimer ce tutoriel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </h2>
            <div class="mt-4 prose">
              <div class="text-gray-600 mb-4">
                <span class="mr-4">
                  <i class="fas fa-calendar"></i>
                  {{ new Date(tutorial.dateCreation).toLocaleDateString() }}
                </span>
              </div>
              <div v-html="compiledMarkdown(tutorial.content)" class="line-clamp-3"></div>
            </div>
          </div>

          <div class="mt-4 lg:w-1/2 lg:mt-0" v-if="tutorial.image">
            <img 
              class="object-cover w-full h-64 rounded-lg md:h-96"
              :src="tutorial.image"
              :alt="tutorial.titre"
            >
          </div>
        </section>
      </section>
    </div>

    <AddTutorialModal
      :show="showAddTutorial"
      @close="closeModal"
      @add-tutorial="addTutorial"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/config/supabase'
import AddTutorialModal from '@/components/AddTutorialModal.vue'
import { marked } from 'marked'

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
  return tutorials.value.filter(t => t.categorie === selectedCategory.value)
})

onMounted(async () => {
  const { data, error } = await supabase
    .from('tutoriels')
    .select('*')
    .order('dateCreation', { ascending: false })

  if (error) {
    console.error('Erreur lors du chargement des tutoriels:', error)
    return
  }

  tutorials.value = data

  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null
})

const handleButtonClick = () => {
  showAddTutorial.value = true
}

const closeModal = () => {
  showAddTutorial.value = false
}

const addTutorial = async (tutorialData) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.error('Utilisateur non connecté')
      return
    }

    const { data, error } = await supabase
      .from('tutoriels')
      .insert([
        {
          titre: tutorialData.title,
          content: tutorialData.content,
          categorie: tutorialData.category,
          image: tutorialData.image,
          dateCreation: new Date(),
          dateModification: new Date(),
          idUtilisateur: session.user.id
        }
      ])

    if (error) throw error

    const { data: updatedData } = await supabase
      .from('tutoriels')
      .select('*')
      .order('dateCreation', { ascending: false })
    
    tutorials.value = updatedData
    showAddTutorial.value = false
  } catch (error) {
    console.error('Erreur lors de l\'ajout du tutoriel:', error)
  }
}

const deleteTutorial = async (tutorial) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce tutoriel ?')) {
    return
  }

  try {
    // Si le tutoriel a une image, la supprimer du storage
    if (tutorial.image) {
      const imageUrl = new URL(tutorial.image)
      const imagePath = imageUrl.pathname.split('/').pop()
      
      const { error: storageError } = await supabase.storage
        .from('tutorial-images')
        .remove([imagePath])

      if (storageError) {
        console.error('Erreur lors de la suppression de l\'image:', storageError)
      }
    }

    // Supprimer le tutoriel de la base de données
    const { error: dbError } = await supabase
      .from('tutoriels')
      .delete()
      .match({ id: tutorial.id, idUtilisateur: user.value.id })

    if (dbError) throw dbError

    // Mettre à jour la liste des tutoriels localement
    tutorials.value = tutorials.value.filter(t => t.id !== tutorial.id)
    
  } catch (error) {
    console.error('Erreur lors de la suppression du tutoriel:', error)
    alert('Erreur lors de la suppression du tutoriel')
  }
}

const compiledMarkdown = (content) => {
  return marked(content || '')
}
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