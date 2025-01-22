<template>
  <div class="w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Bienvenue au Département d'Informatique</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="course in courses" :key="course.id" 
             class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-bold mb-4">{{ course.name }}</h2>
          <p class="text-gray-600 text-lg mb-4">{{ course.description }}</p>
          <div class="mt-4">
            <router-link :to="course.link" 
                        class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              En savoir plus 
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const courses = [
  {
    id: 1,
    name: 'BUT Informatique 1',
    description: 'Introduction à la programmation avec Python et concepts fondamentaux de l\'algorithmique. Apprentissage des structures de base et résolution de problèmes.',
    link: '/resources#but1'
  },
  {
    id: 2,
    name: 'BUT Informatique 2',
    description: 'Approfondissement des concepts de programmation, structures de données avancées et introduction au développement web avec JavaScript.',
    link: '/resources#but2'
  },
  {
    id: 3,
    name: 'BUT Informatique 3',
    description: 'Développement d\'applications web modernes, gestion de projets et introduction aux bases de données. Focus sur les frameworks actuels.',
    link: '/resources#but3'
  }
]
</script>
