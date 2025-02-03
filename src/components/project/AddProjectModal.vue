<template>
  <div v-if="props.show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <div class="relative w-full max-w-2xl rounded-lg bg-white p-4 shadow-xl">
        <div class="max-h-[80vh] overflow-y-auto">
          <h2 class="mb-4 text-xl font-bold">Ajouter un projet</h2>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Première ligne: Titre et Type -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Titre</label>
                <input
                  v-model="project.titre"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Type</label>
                <select
                  v-model="project.type"
                  required
                  class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="web">Web</option>
                  <option value="jeuxvideo">Jeux vidéo</option>
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="ia">Intelligence Artificielle</option>
                  <option value="cybersecurite">Cybersécurité</option>
                  <option value="robotique">Robotique</option>
                  <option value="realite_virtuelle">Réalité Virtuelle</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="project.description"
                required
                rows="2"
                class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              ></textarea>
            </div>

            <!-- Deuxième ligne: Liens -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Lien GitHub</label>
                <input
                  v-model="project.lienGithub"
                  type="url"
                  class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Lien Demo</label>
                <input
                  v-model="project.lienDemo"
                  type="url"
                  class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Technologies -->
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Technologies</label>
              <div class="flex items-center space-x-2">
                <input
                  v-model="technologyInput"
                  type="text"
                  placeholder="Ajouter une technologie"
                  class="flex-grow rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  @keyup.enter.prevent="addTechnology"
                />
                <button
                  type="button"
                  @click="addTechnology"
                  class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  +
                </button>
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="(tech, index) in project.technologies"
                  :key="index"
                  class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                >
                  {{ tech }}
                  <button
                    type="button"
                    @click="removeTechnology(index)"
                    class="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>

            <!-- Collaborateurs -->
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Collaborateurs</label>
              <div class="space-y-2">
                <div v-for="(collab, index) in project.collaborateurs" :key="index">
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="collab.email"
                      type="email"
                      placeholder="Email du collaborateur"
                      class="flex-grow rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      @click="searchUser(index)"
                      class="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      Chercher
                    </button>
                    <select
                      v-if="collab.userFound"
                      v-model="collab.role"
                      class="w-32 rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="contributor">Contributeur</option>
                      <option value="owner">Propriétaire</option>
                    </select>
                    <button
                      type="button"
                      @click="removeCollaborator(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                  <p v-if="collab.userFound" class="mt-1 text-sm text-green-600">
                    Utilisateur trouvé
                  </p>
                  <p v-if="collab.error" class="mt-1 text-sm text-red-600">
                    {{ collab.error }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="addCollaborator"
                  class="mt-2 rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                >
                  + Ajouter un collaborateur
                </button>
              </div>
            </div>

            <!-- Image -->
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Image de couverture</label>
              <input 
                type="file" 
                accept="image/*"
                @change="handleImageUpload"
                class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              <div v-if="imagePreview" class="mt-2">
                <img :src="imagePreview" alt="Preview" class="h-32 w-full object-cover rounded-lg">
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Créer le projet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/config/supabase'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['add-project', 'close'])

const project = ref({
  titre: '',
  description: '',
  type: '',
  lienGithub: '',
  lienDemo: '',
  technologies: [],
  collaborateurs: [],
  image: null
})

const technologies = ref([])
const technologyInput = ref('')
const authStore = useAuthStore()
const fileInput = ref(null)
const imagePreview = ref(null)
const uploadProgress = ref(0)
const isUploading = ref(false)

const availableUsers = ref([])

// Charger la liste des utilisateurs disponibles
const loadAvailableUsers = async () => {
  try {
    const { data: users, error } = await supabase
      .from('utilisateurs')
      .select('id, email')
      .neq('id', authStore.user.id)

    if (error) throw error
    availableUsers.value = users
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  }
}

const addTechnology = () => {
  if (technologyInput.value) {
    project.value.technologies.push(technologyInput.value)
    technologyInput.value = ''
  }
}

const removeTechnology = (index) => {
  project.value.technologies.splice(index, 1)
}

const addCollaborator = () => {
  project.value.collaborateurs.push({
    email: '',
    userId: null,
    role: 'contributor',
    userFound: false,
    error: null
  })
}

const removeCollaborator = (index) => {
  project.value.collaborateurs.splice(index, 1)
}

const searchUser = async (index) => {
  const collaborator = project.value.collaborateurs[index]
  collaborator.error = null
  collaborator.userFound = false

  try {
    if (!collaborator.email) {
      collaborator.error = "L'email est requis"
      return
    }

    // Vérifier que l'utilisateur ne s'ajoute pas lui-même
    const { data: { session } } = await supabase.auth.getSession()
    if (collaborator.email === session?.user?.email) {
      collaborator.error = "Vous ne pouvez pas vous ajouter vous-même comme collaborateur"
      return
    }

    // Vérifier que l'email n'est pas déjà dans la liste
    const isDuplicate = project.value.collaborateurs.some(
      (c, i) => i !== index && c.email === collaborator.email
    )
    if (isDuplicate) {
      collaborator.error = "Ce collaborateur est déjà dans la liste"
      return
    }

    // Rechercher l'utilisateur
    const { data: userData, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', collaborator.email)
      .single()

    if (error || !userData) {
      collaborator.error = "Utilisateur non trouvé"
      return
    }

    collaborator.userFound = true
    collaborator.role = 'contributor' // Définir le rôle par défaut
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'utilisateur:', error)
    collaborator.error = "Erreur lors de la recherche de l'utilisateur"
  }
}

const closeModal = () => {
  emit('close')
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Vérifier le type de fichier
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    alert('Seules les images au format JPG, JPEG ou PNG sont acceptées')
    event.target.value = ''
    return
  }

  // Vérifier la taille du fichier (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB en octets
  if (file.size > maxSize) {
    alert('L\'image ne doit pas dépasser 5MB')
    event.target.value = ''
    return
  }

  // Créer un aperçu de l'image
  imagePreview.value = URL.createObjectURL(file)
  
  try {
    isUploading.value = true
    
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop().toLowerCase()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload du fichier
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
        onUploadProgress: (progress) => {
          uploadProgress.value = Math.round((progress.loaded / progress.total) * 100)
        }
      })

    if (error) throw error

    console.log('Image uploadée avec succès:', data)

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)

    console.log('URL publique générée:', publicUrl)

    project.value.image = publicUrl
    console.log('URL finale de l\'image:', project.value.image)

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    alert('Erreur lors de l\'upload de l\'image')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const handleSubmit = async () => {
  if (isUploading.value) {
    alert('Veuillez attendre la fin de l\'upload de l\'image')
    return
  }

  try {
    // Récupérer l'utilisateur connecté
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Vous devez être connecté pour créer un projet')
      return
    }

    console.log('Préparation des données du projet avec image:', project.value.image)
    
    const projectData = {
      titre: project.value.titre,
      description: project.value.description,
      type: project.value.type,
      lienGithub: project.value.lienGithub,
      lienDemo: project.value.lienDemo,
      image: project.value.image,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      
    }

    console.log('Données du projet à envoyer:', projectData)

    // Créer le projet
    const { data: newProject, error: projectError } = await supabase
      .from('projets')
      .insert([projectData])
      .select()
      .single()

    if (projectError) throw projectError

    // Ajouter le propriétaire
    const ownerPromise = supabase
      .from('projet_utilisateurs')
      .insert([{
        idProjet: newProject.id,
        idUtilisateur: session.user.id,
        role: 'owner',
        dateAjout: new Date().toISOString()
      }])

    // Ajouter les collaborateurs
    const collaborateurPromises = project.value.collaborateurs
      .filter(collab => collab.userFound) // Ne garder que les collaborateurs trouvés
      .map(async (collab) => {
        try {
          const { data: userData, error: userError } = await supabase
            .from('utilisateurs')
            .select('id')
            .eq('email', collab.email)
            .single()

          if (userError || !userData) {
            console.error('Erreur lors de la récupération du collaborateur:', userError)
            return null
          }

          const { data: insertData, error: insertError } = await supabase
            .from('projet_utilisateurs')
            .insert([{
              idProjet: newProject.id,
              idUtilisateur: userData.id,
              role: collab.role,
              dateAjout: new Date().toISOString()
            }])

          if (insertError) {
            console.error('Erreur lors de l\'ajout du collaborateur:', insertError)
            return null
          }

          return insertData
        } catch (error) {
          console.error('Erreur lors de l\'ajout du collaborateur:', error)
          return null
        }
      })

    // Attendre que toutes les insertions soient terminées
    const results = await Promise.all([ownerPromise, ...collaborateurPromises])
    
    // Vérifier s'il y a eu des erreurs
    const errors = results.filter(r => r === null)
    if (errors.length > 0) {
      console.warn(`${errors.length} collaborateur(s) n'ont pas pu être ajoutés`)
    }

    emit('add-project', projectData)
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error)
    alert('Erreur lors de la création du projet')
  }
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    project.value = {
      titre: '',
      description: '',
      type: '',
      lienGithub: '',
      lienDemo: '',
      technologies: [],
      collaborateurs: [],
      image: null
    }
    technologyInput.value = ''
    imagePreview.value = null
  }
})

loadAvailableUsers()
</script>