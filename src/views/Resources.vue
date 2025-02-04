<template>
  <!-- <section class="bg-white min-h-screen">
    <div class="container px-6 py-10 mx-auto">
      <h1 class="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">Ressources</h1>

      <div class="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 lg:grid-cols-2">
        <div v-for="resource in resources" :key="resource.id" @click="openModal(resource.titre, resource.description, resource.url)" class="flex items-end overflow-hidden bg-cover rounded-lg h-96 cursor-pointer" :style="{ backgroundImage: `url(${resource.image_url})` }">
          <div class="w-full px-8 py-4 overflow-hidden rounded-b-lg backdrop-blur-sm bg-white/60 ">
            <h2 class="mt-4 text-xl font-semibold text-gray-800 capitalize ">{{ resource.titre }}</h2>
            <p class="mt-2 text-lg tracking-wider text-blue-500 uppercase">{{ resource.type }}</p>
          </div>
        </div>
      </div>
    </div>

    <ResourceModal :show="showModal" :title="modalTitle" :content="modalContent" :link="modalLink" @close="closeModal" />
  </section> -->

  <section class="bg-white">
    <div class="container px-6 py-10 mx-auto">
        <h1 class="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">Ressources</h1>

        <p class="mt-4 text-center text-gray-500">
            Bienvenue sur le recueil des ressources
        </p>

        <div class="grid grid-cols-1 gap-8 mt-8 xl:mt-12 md:grid-cols-2 xl:grid-cols-3">
            <div v-for="resource in resources" :key="resource.id" @click="openModal(resource.titre, resource.description, resource.url)" class="cursor-pointer">
                <img class="object-cover w-full rounded-lg h-96"
                     :src="resource.image_url"
                     :alt="`Image de ${resource.titre}`">
                <h2 class="mt-4 text-xl font-semibold text-gray-800 capitalize">{{ resource.titre }}</h2>
                <p class="mt-2 text-lg tracking-wider text-blue-500 uppercase">{{ resource.type }}</p>
            </div>
        </div>
    </div>

    <ResourceModal :show="showModal" :title="modalTitle" :content="modalContent" :link="modalLink" @close="closeModal" />
</section>


</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/config/supabase'
import ResourceModal from '@/components/project/ResourceModal.vue'

const resources = ref([])
const showModal = ref(false)
const modalTitle = ref('')
const modalContent = ref('')
const modalLink = ref('')

onMounted(async () => {
  const { data, error } = await supabase
    .from('ressources')
    .select('*')

  if (error) {
    console.error('Erreur lors du chargement des ressources:', error)
  } else {
    resources.value = data
  }
})

const openModal = (title, content, link) => {
  modalTitle.value = title
  modalContent.value = content
  modalLink.value = link
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>