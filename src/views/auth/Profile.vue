<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête du profil -->
      <ProfileHeader
        :profile="profile"
      />

      <!-- Statistiques -->
      <ProfileStats
        :stats="{
          projects: userProjects.length,
          tutorials: userTutorials.length,
          resources: userResources.length
        }"
      />

      <!-- Navigation -->
      <div class="mt-8 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="currentTab = tab.name"
            :class="[
              currentTab === tab.name
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Projets -->
      <div v-if="currentTab === 'projects'" class="mt-6">
        <div v-if="userProjects.length === 0" class="text-center py-12">
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun projet</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ isCurrentUser ? "Commencez par créer votre premier projet." : "Cet utilisateur n'a pas encore de projets." }}
          </p>
          <div v-if="isCurrentUser" class="mt-6">
            <button
              @click="$router.push('/projets')"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
            v-for="project in userProjects"
            :key="project.id"
            :project="project"
          />
        </div>
      </div>

      <!-- Tutoriels -->
      <div v-if="currentTab === 'tutorials'" class="mt-6">
        <div v-if="userTutorials.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun tutoriel</h3>
          <p class="mt-1 text-sm text-gray-500">Partagez vos connaissances en créant un tutoriel.</p>
          <div class="mt-6">
            <button
              @click="$router.push('/tutoriels')"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Créer un tutoriel
            </button>
          </div>
        </div>

        <div v-else class="space-y-6">
          <TutorialCard
            v-for="tutorial in userTutorials"
            :key="tutorial.id"
            :tutorial="tutorial"
          />
        </div>
      </div>

      <!-- Ressources -->
      <div v-if="currentTab === 'resources'" class="mt-6">
        <div v-if="userResources.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune ressource</h3>
          <p class="mt-1 text-sm text-gray-500">Partagez des ressources avec la communauté.</p>
          <div class="mt-6">
            <button
              @click="$router.push('/ressources')"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Créer une ressource
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ResourceCard
            v-for="resource in userResources"
            :key="resource.id"
            :resource="resource"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileStats from '@/components/profile/ProfileStats.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import TutorialCard from '@/components/tutorial/TutorialCard.vue'
import ResourceCard from '@/components/resource/ResourceCard.vue'

const route = useRoute()
const authStore = useAuthStore()

const profile = ref({})
const userProjects = ref([])
const userTutorials = ref([])
const userResources = ref([])
const currentTab = ref('projects')

const tabs = [
  { name: 'projects', label: 'Projets' },
  { name: 'tutorials', label: 'Tutoriels' },
  { name: 'resources', label: 'Ressources' }
]

const isCurrentUser = computed(() => {
  return profile.value?.id === authStore.user?.id
})

// Fonction pour supprimer un projet
const deleteProject = async (project) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
    return
  }

  try {
    const { error } = await supabase
      .from('projets')
      .delete()
      .eq('id', project.id)

    if (error) throw error

    await fetchUserProjects()
    
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error)
    alert('Erreur lors de la suppression du projet')
  }
}

// Fonction pour charger les projets de l'utilisateur
const fetchUserProjects = async () => {
  const userId = route.params.id || authStore.user?.id
  if (!userId) return

  try {
    const { data, error } = await supabase
      .from('projets')
      .select(`
        *,
        projet_utilisateurs (
          role,
          idUtilisateur,
          utilisateurs:idUtilisateur (
            id,
            email,
            profils!inner (
              nom,
              prenom
            )
          )
        )
      `)
      .eq('projet_utilisateurs.idUtilisateur', userId)
      .eq('projet_utilisateurs.role', 'owner')

    if (error) throw error

    userProjects.value = data.map(project => {
      const owner = project.projet_utilisateurs.find(pu => pu.role === 'owner')
      const collaborateurs = project.projet_utilisateurs
        .filter(pu => pu.role === 'contributor')
        .map(pu => ({
          id: pu.utilisateurs.id,
          email: pu.utilisateurs.email,
          nom: pu.utilisateurs.profils.nom,
          prenom: pu.utilisateurs.profils.prenom
        }))

      return {
        ...project,
        idUtilisateur: owner?.idUtilisateur,
        collaborateurs
      }
    })
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error)
  }
}

// Fonction pour charger les tutoriels de l'utilisateur
const fetchUserTutorials = async () => {
  const userId = route.params.id || authStore.user?.id
  if (!userId) return

  try {
    const { data, error } = await supabase
      .from('tutoriels')
      .select('*')
      .eq('idUtilisateur', userId)
      .order('dateCreation', { ascending: false })

    if (error) throw error

    userTutorials.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des tutoriels:', error)
  }
}

// Fonction pour charger les ressources de l'utilisateur
const fetchUserResources = async () => {
  const userId = route.params.id || authStore.user?.id
  if (!userId) return

  try {
    const { data, error } = await supabase
      .from('ressources')
      .select('*')
      .eq('idUtilisateur', userId)
      .order('dateCreation', { ascending: false })

    if (error) throw error

    userResources.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error)
  }
}

// Chargement des données
onMounted(async () => {
  const userId = route.params.id || authStore.user?.id
  if (!userId) return

  try {
    // Charger le profil
    const { data: userData, error: userError } = await supabase
      .from('utilisateurs')
      .select(`
        *,
        profils (*)
      `)
      .eq('id', userId)
      .single()

    if (userError) throw userError

    profile.value = {
      id: userData.id,
      email: userData.email,
      ...userData.profils
    }

    // Charger les projets
    await fetchUserProjects()

    // Charger les tutoriels
    await fetchUserTutorials()

    // Charger les ressources
    await fetchUserResources()

  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})
</script>