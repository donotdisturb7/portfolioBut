<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
      <h2 class="text-xl font-bold mb-4">Nouveau Tutoriel</h2>
      <form @submit.prevent="submitTutorial">
        <div class="mb-4">
          <label class="block text-gray-700">Titre</label>
          <input v-model="tutorial.title" class="w-full px-3 py-2 border rounded" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Catégorie</label>
          <select 
            v-model="tutorial.category" 
            class="w-full px-3 py-2 border rounded" 
            required
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="programmation">Programmation</option>
            <option value="web">Développement Web</option>
            <option value="mobile">Développement Mobile</option>
            <option value="devops">DevOps</option>
            <option value="database">Bases de données</option>
            <option value="security">Sécurité</option>
            <option value="cloud">Cloud Computing</option>
            <option value="ai">Intelligence Artificielle</option>
            <option value="tools">Outils et Méthodologies</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Contenu (Markdown)</label>
          <textarea v-model="tutorial.content" class="w-full px-3 py-2 border rounded" rows="10" required></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Image de couverture</label>
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
              class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Choisir une image
            </button>
            <span v-if="uploadProgress" class="text-sm text-gray-600">
              Upload: {{ uploadProgress }}%
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1">Formats acceptés : JPG, JPEG, PNG</p>
          <div v-if="imagePreview" class="mt-4">
            <img :src="imagePreview" class="w-full max-h-48 object-cover rounded-lg">
          </div>
        </div>
        <div class="flex justify-end">
          <button type="button" @click="close" class="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Annuler</button>
          <button 
            type="submit" 
            class="bg-blue-600 text-white px-4 py-2 rounded-lg"
            :disabled="isUploading"
          >
            {{ isUploading ? 'Upload en cours...' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/config/supabase'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const tutorial = ref({
  title: '',
  category: '',
  content: '',
  image: null
})

const emit = defineEmits(['add-tutorial', 'close'])
const fileInput = ref(null)
const imagePreview = ref(null)
const uploadProgress = ref(0)
const isUploading = ref(false)

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Vérifier le type de fichier
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    alert('Seules les images au format JPG, JPEG ou PNG sont acceptées')
    event.target.value = '' // Réinitialiser l'input
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
      .from('tutorial-images')
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
      .from('tutorial-images')
      .getPublicUrl(filePath)

    tutorial.value.image = publicUrl
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    alert('Erreur lors de l\'upload de l\'image')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const submitTutorial = async () => {
  if (isUploading.value) {
    alert('Veuillez attendre la fin de l\'upload de l\'image')
    return
  }
  
  emit('add-tutorial', tutorial.value)
  resetForm()
}

const close = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  tutorial.value = {
    title: '',
    category: '',
    content: '',
    image: null
  }
  imagePreview.value = null
  uploadProgress.value = 0
}
</script>