<template>
  <div v-if="props.show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <div class="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 class="mb-4 text-xl font-bold">Ajouter un projet</h2>

        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">Titre</label>
            <input
              v-model="project.titre"
              type="text"
              required
              class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="project.description"
              required
              rows="3"
              class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">Type</label>
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

          <!-- Technologies -->
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">Technologies</label>
            <div class="flex space-x-2">
              <input
                v-model="technologyInput"
                type="text"
                @keyup.enter="addTechnology"
                class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                placeholder="Ajouter une technologie"
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
                v-for="(tech, index) in technologies"
                :key="index"
                class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
              >
                {{ tech }}
                <button
                  type="button"
                  @click="removeTechnology(index)"
                  class="ml-2 text-blue-400 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">Lien GitHub (optionnel)</label>
            <input
              v-model="project.lienGithub"
              type="text"
              placeholder="username/repository"
              class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div class="mb-6">
            <label class="mb-2 block text-sm font-medium text-gray-700">Lien démo (optionnel)</label>
            <input
              v-model="project.lienDemo"
              type="text"
              placeholder="example.com"
              class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">Image de couverture</label>
            <div class="flex items-center space-x-4">
              <input 
                type="file" 
                @change="handleImageUpload" 
                accept=".jpg,.jpeg,.png"
                class="hidden" 
                ref="fileInput"
              >
              <button 
                type="button" 
                @click="$refs.fileInput.click()"
                class="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 transition-colors"
                :disabled="isUploading"
              >
                {{ isUploading ? 'Upload en cours...' : 'Choisir une image' }}
              </button>
              <div v-if="isUploading" class="flex items-center space-x-2">
                <div class="h-1 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-blue-500 transition-all duration-300" 
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                </div>
                <span class="text-sm text-gray-600">{{ uploadProgress }}%</span>
              </div>
            </div>
            <p class="mt-1 text-sm text-gray-500">Formats acceptés : JPG, JPEG, PNG. Taille max : 5MB</p>
            <div v-if="imagePreview" class="mt-4 relative">
              <img :src="imagePreview" class="w-full max-h-48 object-cover rounded-lg">
              <button 
                v-if="!isUploading"
                type="button" 
                @click="removeImage" 
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              :disabled="isUploading"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isUploading"
            >
              {{ isUploading ? 'Upload en cours...' : 'Ajouter' }}
            </button>
          </div>
        </form>
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
  image: null
})

const technologies = ref([])
const technologyInput = ref('')
const authStore = useAuthStore()
const fileInput = ref(null)
const imagePreview = ref(null)
const uploadProgress = ref(0)
const isUploading = ref(false)

const addTechnology = () => {
  if (technologyInput.value) {
    technologies.value.push(technologyInput.value)
    technologyInput.value = ''
  }
}

const removeTechnology = (index) => {
  technologies.value.splice(index, 1)
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
      user_id: session.user.id
    }

    console.log('Données du projet à envoyer:', projectData)

    const { data, error } = await supabase
      .from('projets')
      .insert([projectData])

    if (error) throw error
    
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
      image: null
    }
    technologies.value = []
    technologyInput.value = ''
    imagePreview.value = null
  }
})
</script>