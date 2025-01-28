<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Projets</h1>
      <button v-if="estAuthentifie && estEtudiant" 
              @click="showAddProjectModal = true" 
              class="btn-primary">
        Ajouter un projet
      </button>
    </div>

    <!-- Liste des projets -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary] mx-auto"></div>
    </div>

    <div v-else-if="projects.length === 0" class="text-center py-8 text-gray-500">
      Aucun projet n'a encore été ajouté.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard v-for="project in projects" 
                  :key="project.id" 
                  :project="project"
                  @click="handleProjectClick(project)" />
    </div>

    <!-- Modal d'ajout de projet -->
    <AddProjectModal v-if="showAddProjectModal"
                    @close="showAddProjectModal = false"
                    @project-added="handleProjectAdded" />

    <!-- Modal de détails du projet -->
    <ProjectDetailsModal v-if="selectedProject"
                        :project="selectedProject"
                        :show="showDetailsModal"
                        @close="closeDetailsModal"
                        @project-deleted="handleProjectDeleted" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '~/firebase/config'
import { useAuthStore } from '~/stores/auth'
import ProjectCard from '~/components/ProjectCard.vue'
import AddProjectModal from '~/components/AddProjectModal.vue'
import ProjectDetailsModal from '~/components/ProjectDetailsModal.vue'

const authStore = useAuthStore()
const estAuthentifie = computed(() => authStore.estAuthentifie)
const estEtudiant = computed(() => authStore.estEtudiant)

const projects = ref([])
const loading = ref(true)
const showAddProjectModal = ref(false)
const showDetailsModal = ref(false)
const selectedProject = ref(null)

const loadProjects = async () => {
  try {
    loading.value = true
    const projectsRef = collection(db, 'projects')
    const q = query(projectsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    projects.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error)
  } finally {
    loading.value = false
  }
}

const handleProjectClick = (project) => {
  selectedProject.value = project
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedProject.value = null
}

const handleProjectAdded = (newProject) => {
  projects.value = [newProject, ...projects.value]
}

const handleProjectDeleted = (projectId) => {
  projects.value = projects.value.filter(p => p.id !== projectId)
}

onMounted(() => {
  loadProjects()
})
</script>