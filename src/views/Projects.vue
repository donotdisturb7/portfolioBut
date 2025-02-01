<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Projets</h1>
      <button
        v-if="user"
        @click="handleButtonClick"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Nouveau projet
      </button>
    </div>

    <div v-if="projects.length === 0" class="text-center py-12 text-gray-500">
      Aucun projet pour le moment
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <!-- Image de couverture -->
        <div class="relative h-48">
          <img 
            v-if="project.image"
            :src="project.image"
            :alt="project.titre"
            class="w-full h-full object-cover"
            @error="handleImageError"
            @load="() => console.log('Image chargée avec succès:', project.image)"
          />
          <div 
            v-else
            class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <!-- Badge de type -->
          <span 
            class="absolute top-4 right-4 px-3 py-1 text-sm font-medium rounded-full shadow-md"
            :class="{
              'bg-blue-500 text-white': project.type === 'web',
              'bg-purple-500 text-white': project.type === 'jeuxvideo',
              'bg-green-500 text-white': project.type === 'desktop',
              'bg-yellow-500 text-white': project.type === 'mobile',
              'bg-red-500 text-white': project.type === 'ia',
              'bg-indigo-500 text-white': project.type === 'cybersecurite',
              'bg-orange-500 text-white': project.type === 'robotique',
              'bg-teal-500 text-white': project.type === 'realite_virtuelle',
              'bg-gray-500 text-white': project.type === 'autre'
            }"
          >
            {{ project.type }}
          </span>
        </div>

        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ project.titre }}</h3>
          <p class="text-gray-600 mb-4">{{ project.description }}</p>

          <!-- Technologies -->
          <div class="mb-4 flex flex-wrap gap-2">
            <span
              v-for="(tech, index) in project.technologies"
              :key="index"
              class="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {{ tech }}
            </span>
          </div>

          <!-- Liens -->
          <div class="flex space-x-4">
            <a
              v-if="project.github_url"
              :href="project.github_url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-gray-600 hover:text-blue-600"
            >
              <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a
              v-if="project.project_url"
              :href="project.project_url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-gray-600 hover:text-blue-600"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Démo
            </a>
            <button
              @click="deleteProject(project)"
              class="inline-flex items-center text-gray-600 hover:text-red-600"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AddProjectModal 
    v-if="showAddProject"
    :show="showAddProject"
    @add-project="addProject"
    @close="closeModal"
  />
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
    .select('id, titre, description, type, lienGithub, lienDemo, image, dateCreation, dateModification')
    .order('dateCreation', { ascending: false })

  if (error) {
    console.error('Erreur lors du chargement des projets:', error)
    return
  }

  projects.value = data
  console.log('Projets chargés avec leurs images:', projects.value.map(p => ({
    titre: p.titre,
    image: p.image,
    dateCreation: p.dateCreation
  })))

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
    // Mettre à jour la liste des projets localement
    projects.value = [projectData, ...projects.value]
    
    // Fermer le modal
    showAddProject.value = false
    
    // Recharger les projets depuis Supabase
    const { data, error } = await supabase
      .from('projets')
      .select('*')
      .order('dateCreation', { ascending: false })

    if (error) throw error
    projects.value = data
  } catch (error) {
    console.error('Erreur lors de l\'ajout du projet:', error)
    alert('Erreur lors de l\'ajout du projet')
  }
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x200'
}

const deleteProject = async (project) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
    return
  }

  try {
    // Si le projet a une image, la supprimer du storage
    if (project.image) {
      const imageUrl = new URL(project.image)
      const imagePath = imageUrl.pathname.split('/').pop()
      
      const { error: storageError } = await supabase.storage
        .from('project-images')
        .remove([imagePath])

      if (storageError) {
        console.error('Erreur lors de la suppression de l\'image:', storageError)
      }
    }

    // Supprimer le projet de la base de données
    const { error: dbError } = await supabase
      .from('projets')
      .delete()
      .match({ id: project.id, user_id: user.value.id })

    if (dbError) throw dbError

    // Mettre à jour la liste des projets localement
    projects.value = projects.value.filter(p => p.id !== project.id)
    
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error)
    alert('Erreur lors de la suppression du projet')
  }
}
</script>