<template>
  <div class="flex h-screen">
    <!-- Côté formulaire -->
    <div class="flex-1 flex items-center justify-center bg-[#FFFFFF] p-8">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <router-link to="/" class="inline-block">
            <h2 class="text-2xl font-bold text-gray-900">Portfolio BUT</h2>
          </router-link>
        </div>

        <div class="bg-[#FFFFFF] p-8 rounded-lg">
          <h1 class="text-2xl font-bold text-gray-900 mb-8">Connexion à votre compte</h1>
          
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-900 mb-2">Adresse email</label>
              <input 
                v-model="email"
                type="email" 
                name="email" 
                id="email" 
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="nom@exemple.com" 
                required
              >
            </div>

            <div>
              <label for="motDePasse" class="block text-sm font-medium text-gray-900 mb-2">Mot de passe</label>
              <input 
                v-model="motDePasse"
                type="password" 
                name="motDePasse" 
                id="motDePasse" 
                placeholder="••••••••" 
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                required
              >
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input 
                    id="remember" 
                    aria-describedby="remember" 
                    type="checkbox" 
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  >
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500">Se souvenir de moi</label>
                </div>
              </div>
              <a href="#" class="text-sm font-medium text-blue-600 hover:underline">Mot de passe oublié?</a>
            </div>

            <button 
              type="submit" 
              :disabled="chargement"
              class="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {{ chargement ? 'Connexion...' : 'Se connecter' }}
            </button>

            <div v-if="erreur" class="text-center text-sm text-red-600 mt-2">
              {{ erreur }}
            </div>

            <p class="text-sm text-center text-gray-500 mt-4">
              Pas encore de compte? 
              <router-link to="/register" class="font-medium text-blue-600 hover:underline">
                S'inscrire
              </router-link>
            </p>
          </form>
        </div>
      </div>
    </div>

    <!-- Côté image -->
    <div class="hidden lg:block lg:w-1/2" 
         style="background-image: url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
                background-size: cover;
                background-position: center;">
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
