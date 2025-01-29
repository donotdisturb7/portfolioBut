<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Projets des Etudiants</h1>
    
    <div v-if="user" class="mb-8">
      <button @click="showAddProject = true" 
              class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors">
        Ajouter un nouveau projet
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="project in projects" :key="project.id" 
           class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1">
        <img :src="project.image_url || '/placeholder.png'" :alt="project.title"
             class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ project.title }}</h3>
          <p class="text-gray-600 mb-4">{{ project.description }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in project.tags" :key="tag" 
                  class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {{ tag }}
            </span>
          </div>
          <a :href="project.github_url" target="_blank" rel="noopener" 
             class="inline-block bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors">
            Voir sur GitHub
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/config/supabase'

const user = ref(null)
const projects = ref([])
const showAddProject = ref(false)

onMounted(async () => {
  // Récupération des projets depuis Supabase
  const { data, error } = await supabase
    .from('projets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors du chargement des projets:', error)
    return
  }

  projects.value = data

  // Vérification de l'utilisateur connecté
  const session = supabase.auth.getSession()
  user.value = session?.user || null
})

const addProject = async (projectData) => {
  try {
    // Ajout du projet dans la base de données
    const { error } = await supabase
      .from('projets')
      .insert([
        {
          ...projectData,
          user_id: user.value.id
        }
      ])

    if (error) throw error
    
    // Actualisation de la liste des projets
    const { data } = await supabase
      .from('projets')
      .select('*')
      .order('created_at', { ascending: false })
    
    projects.value = data
    showAddProject.value = false
  } catch (error) {
    console.error('Erreur lors de l\'ajout du projet:', error)
  }
}
</script>

