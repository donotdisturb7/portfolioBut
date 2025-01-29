<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
       style="background-image: url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;">
    <div class="max-w-md w-full space-y-8 bg-white/90 p-8 rounded-lg shadow-lg backdrop-blur-sm">
      <div class="text-center">
        <h2 class="text-4xl font-bold text-center text-gray-700">Connexion</h2>
        <p class="mt-3 text-gray-500">Connectez-vous à votre compte</p>
      </div>

      <div class="mt-8">
        <form @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block mb-2 text-sm text-gray-600">Adresse Email</label>
            <input 
              v-model="email"
              type="email"
              id="email"
              required
              placeholder="exemple@mail.com"
              class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div class="mt-6">
            <label for="motDePasse" class="block mb-2 text-sm text-gray-600">Mot de passe</label>
            <input 
              v-model="motDePasse"
              type="password"
              id="motDePasse"
              required
              placeholder="Votre mot de passe"
              class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div class="mt-6">
            <button
              type="submit"
              :disabled="chargement"
              class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              {{ chargement ? 'Connexion...' : 'Se connecter' }}
            </button>
          </div>
        </form>

        <div v-if="erreur" class="mt-4 text-center text-red-600">
          {{ erreur }}
        </div>

        <p class="mt-6 text-sm text-center text-gray-400">
          Pas encore de compte ?
          <router-link
            to="/register"
            class="text-blue-500 focus:outline-none focus:underline hover:underline"
          >
            S'inscrire
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

const router = useRouter()
const email = ref('')
const motDePasse = ref('')
const erreur = ref('')
const chargement = ref(false)

const handleSubmit = async () => {
  chargement.value = true
  erreur.value = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: motDePasse.value
    })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        erreur.value = "Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte mail."
      } else {
        throw error
      }
      return
    }

    router.push('/')
  } catch (err) {
    console.error('Erreur de connexion:', err)
    erreur.value = "Erreur lors de la connexion. Vérifiez vos identifiants."
  } finally {
    chargement.value = false
  }
}
</script>
