<template>
  <div class="w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Ressources de Programmation</h1>
      
      <div class="space-y-16">
        <section v-for="category in categories" :key="category.id" :id="category.id">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">{{ category.name }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="resource in category.resources" :key="resource.id"
                 class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 class="text-xl font-bold mb-3">{{ resource.title }}</h3>
              <p class="text-gray-600 text-lg mb-4">{{ resource.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {{ resource.type }}
                </span>
                <a :href="resource.link" target="_blank" rel="noopener"
                   class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  Accéder
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const categories = [
  {
    id: 'cs1',
    name: 'Ressources Informatique 1',
    resources: [
      {
        id: 1,
        title: 'Fondamentaux Python',
        description: 'Guide complet des bases de Python avec exercices interactifs. Parfait pour débuter la programmation.',
        type: 'Tutoriel',
        link: 'https://docs.python.org/fr/3/tutorial/'
      },
      {
        id: 2,
        title: 'Algorithmique de Base',
        description: 'Introduction aux concepts fondamentaux de l\'algorithmique et à la résolution de problèmes.',
        type: 'Cours',
        link: '#'
      }
    ]
  },
  {
    id: 'cs2',
    name: 'Ressources Informatique 2',
    resources: [
      {
        id: 3,
        title: 'Structures de Données Avancées',
        description: 'Cours approfondi sur les structures de données avec exemples en JavaScript.',
        type: 'Cours',
        link: '#'
      },
      {
        id: 4,
        title: 'Développement Web avec Vue.js',
        description: 'Documentation officielle Vue.js en français avec tutoriels pratiques.',
        type: 'Documentation',
        link: 'https://fr.vuejs.org/guide/introduction.html'
      }
    ]
  },
  {
    id: 'cs3',
    name: 'Ressources Informatique 3',
    resources: [
      {
        id: 5,
        title: 'Frameworks Web Modernes',
        description: 'Guide complet sur les frameworks web modernes et les meilleures pratiques de développement.',
        type: 'Guide',
        link: '#'
      },
      {
        id: 6,
        title: 'Gestion de Version avec Git',
        description: 'Maîtrisez Git avec des tutoriels interactifs et des exemples pratiques.',
        type: 'Tutoriel',
        link: 'https://git-scm.com/book/fr/v2'
      }
    ]
  }
]
</script>
