<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Projets</h1>
        <button
          v-if="user"
          @click="showAddProject = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un projet
        </button>
      </div>

      <div v-if="projects.length === 0" class="text-center py-12">
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun projet</h3>
        <p class="mt-1 text-sm text-gray-500">
          Commencez par créer votre premier projet.
        </p>
        <div class="mt-6">
          <button
            @click="showAddProject = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Créer un projet
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>

    <!-- Modal d'ajout de projet -->
    <AddProjectModal
      :show="showAddProject"
      @close="showAddProject = false"
      @project-added="handleProjectAdded"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import AddProjectModal from '@/components/project/AddProjectModal.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'

const authStore = useAuthStore()
const user = ref(null)
const projects = ref([])
const showAddProject = ref(false)

// Fonction pour charger les projets
const fetchProjects = async () => {
  try {
    console.log('Chargement des projets...')
    const { data: projectsData, error: projectsError } = await supabase
      .from('projets')
      .select(`
        *,
        projet_utilisateurs (
          role,
          utilisateurs (
            id,
            email,
            profils (
              nom,
              prenom
            )
          )
        )
      `)

    if (projectsError) {
      console.error('Erreur lors du chargement des projets:', projectsError)
      throw projectsError
    }

    console.log('Projets chargés:', projectsData)

    projects.value = projectsData.map(project => {
      const owner = project.projet_utilisateurs?.find(pu => pu.role === 'owner')
      const collaborateurs = project.projet_utilisateurs
        ?.filter(pu => pu.role === 'contributor')
        .map(pu => ({
          id: pu.utilisateurs.id,
          email: pu.utilisateurs.email,
          nom: pu.utilisateurs.profils.nom,
          prenom: pu.utilisateurs.profils.prenom
        })) || []

      return {
        ...project,
        owner: owner ? {
          id: owner.utilisateurs.id,
          email: owner.utilisateurs.email,
          nom: owner.utilisateurs.profils.nom,
          prenom: owner.utilisateurs.profils.prenom
        } : null,
        collaborateurs
      }
    })

    console.log('Projets transformés:', projects.value)
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error)
  }
}

// Fonction pour gérer l'ajout d'un projet
const handleProjectAdded = async () => {
  showAddProject.value = false
  await fetchProjects()
}

onMounted(async () => {
  user.value = authStore.user
  await fetchProjects()
})
</script>