<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
      <h2 class="text-xl font-bold mb-4">Modifier le projet</h2>
      
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
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-gray-700">Image de couverture</label>
          <div class="flex items-center space-x-4">
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="hidden"
              ref="fileInput"
            />
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Changer l'image
            </button>
            <span v-if="uploadProgress" class="text-sm text-gray-600">
              Upload: {{ uploadProgress }}%
            </span>
          </div>
          
          <!-- Aperçu de l'image -->
          <div v-if="imagePreview || project.image" class="mt-4">
            <img
              :src="imagePreview || project.image"
              alt="Aperçu"
              class="w-full max-h-48 object-cover rounded-lg"
            />
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

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            :disabled="isUploading"
          >
            {{ isUploading ? "Upload en cours..." : "Enregistrer" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/config/supabase'

const props = defineProps({
  show: Boolean,
  projectData: Object
})

const emit = defineEmits(['close', 'update'])

const project = ref({
  titre: '',
  description: '',
  type: '',
  lienGithub: '',
  lienDemo: '',
  image: null
})

const fileInput = ref(null)
const imagePreview = ref(null)
const uploadProgress = ref(0)
const isUploading = ref(false)

// Initialiser le formulaire avec les données du projet
onMounted(() => {
  if (props.projectData) {
    project.value = { ...props.projectData }
  }
})

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
    
    // Supprimer l'ancienne image si elle existe
    if (project.value.image) {
      const oldImageUrl = new URL(project.value.image)
      const oldImagePath = oldImageUrl.pathname.split('/').pop()
      
      await supabase.storage
        .from('project-images')
        .remove([oldImagePath])
    }

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

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)

    project.value.image = publicUrl

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
    const { error } = await supabase
      .from('projets')
      .update({
        titre: project.value.titre,
        description: project.value.description,
        type: project.value.type,
        lienGithub: project.value.lienGithub,
        lienDemo: project.value.lienDemo,
        image: project.value.image,
        dateModification: new Date().toISOString()
      })
      .match({ id: project.value.id })

    if (error) throw error

    emit('update', project.value)
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la modification du projet:', error)
    alert('Erreur lors de la modification du projet')
  }
}

const closeModal = () => {
  imagePreview.value = null
  emit('close')
}
</script>
