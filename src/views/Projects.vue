<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Projets des Etudiants</h1>
    
    <div v-if="user" class="mb-8">
      <button @click="handleButtonClick" 
              class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors">
        Ajouter un nouveau projet
      </button>
    </div>

    <AddProjectModal v-if="showAddProject" @add-project="addProject" @close="closeModal" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="project in projects" :key="project.id" 
           class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1">
        <img :src="project.image_url || '/placeholder.png'" :alt="project.title"
             class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ project.titre }}</h3>
          <p class="text-gray-600 mb-4">{{ project.description }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in project.technologies" :key="tag" 
                  class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {{ tag }}
            </span>
          </div>
          <a :href="project.lienGithub" target="_blank" rel="noopener" 
             class="inline-block bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors">
            Voir sur GitHub
          </a>
          <a :href="project.lienDemo" target="_blank" rel="noopener" 
             class="inline-block bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors">
            Voir le projet
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/config/supabase'
import AddProjectModal from '@/components/AddProjectModal.vue'

const user = ref(null)
const projects = ref([])
const showAddProject = ref(false)

onMounted(async () => {
  console.log('Mounted Projects.vue')
  
  // Récupération des projets depuis Supabase
  const { data, error } = await supabase
    .from('projets')
    .select('*')
    .order('dateCreation', { ascending: false })

  if (error) {
    console.error('Erreur lors du chargement des projets:', error)
    return
  }

  projects.value = data
  console.log('Projets chargés:', projects.value)

  // Vérification de l'utilisateur connecté
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) {
    console.error('Erreur lors de la récupération de la session:', sessionError)
    return
  }

  user.value = session?.user || null
  console.log('Utilisateur connecté:', user.value)
})

const handleButtonClick = () => {
  console.log('Bouton cliqué')
  showAddProject.value = true
  console.log('showAddProject:', showAddProject.value)
}

const closeModal = () => {
  showAddProject.value = false
  console.log('Modal fermé')
}

const addProject = async (projectData) => {
  try {
    console.log('Données du projet à ajouter:', projectData)
    
    // Ajout du projet dans la base de données
    const { data, error } = await supabase
      .from('projets')
      .insert([
        {
          titre: projectData.title,
          description: projectData.description,
          lienGithub: projectData.github_url,
          lienDemo: projectData.project_url,
          dateCreation: new Date(),
          dateModification: new Date()
        }
      ])

    if (error) {
      console.error('Erreur lors de l\'ajout du projet:', error)
      return
    }

    console.log('Projet ajouté:', data)
    
    // Actualisation de la liste des projets
    const { data: updatedData } = await supabase
      .from('projets')
      .select('*')
      .order('dateCreation', { ascending: false })
    
    projects.value = updatedData
    showAddProject.value = false
  } catch (error) {
    console.error('Erreur lors de l\'ajout du projet:', error)
  }
}
</script>