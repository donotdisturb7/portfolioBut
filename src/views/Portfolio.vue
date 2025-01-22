<template>
  <div class="w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Projets des Étudiants</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="project in projects" :key="project.id" 
             class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <img :src="project.image" :alt="project.title" class="w-full h-56 object-cover"/>
          <div class="p-6">
            <h3 class="text-2xl font-bold mb-3">{{ project.title }}</h3>
            <p class="text-gray-600 text-lg mb-4">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="tech in project.technologies" :key="tech"
                    class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {{ tech }}
              </span>
            </div>
            <a :href="project.github" target="_blank" rel="noopener"
               class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              Voir sur GitHub
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const projects = [
  {
    id: 1,
    title: 'Gestionnaire de Tâches Étudiant',
    description: 'Application web pour la gestion des horaires et des devoirs des étudiants, avec notifications et calendrier intégré.',
    image: 'https://placeholder.co/800x600',
    technologies: ['Vue.js', 'Node.js', 'MongoDB'],
    github: '#'
  },
  {
    id: 2,
    title: 'Navigation Campus Mobile',
    description: 'Application mobile pour faciliter la navigation sur le campus et suivre les événements universitaires en temps réel.',
    image: 'https://placeholder.co/800x600',
    technologies: ['React Native', 'Firebase'],
    github: '#'
  },
  {
    id: 3,
    title: 'IA Prédictive Académique',
    description: 'Modèle d\'apprentissage automatique pour prédire la performance académique et fournir des recommandations personnalisées.',
    image: 'https://placeholder.co/800x600',
    technologies: ['Python', 'TensorFlow', 'Pandas'],
    github: '#'
  }
]
</script>
