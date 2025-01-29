<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLogin ? 'Connexion' : 'Inscription' }}
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe"
            />
          </div>
        </div>

        <div v-if="!isLogin" class="flex items-center">
          <input
            id="estEtudiant"
            v-model="estEtudiant"
            name="estEtudiant"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="estEtudiant" class="ml-2 block text-sm text-gray-900">
            Je suis étudiant en BUT Informatique
          </label>
        </div>

        <div v-if="!isLogin && estEtudiant" class="space-y-4">
          <div>
            <label for="prenom" class="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              id="prenom"
              v-model="prenom"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              id="nom"
              v-model="nom"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="anneePromotion" class="block text-sm font-medium text-gray-700">Année de promotion</label>
            <input
              id="anneePromotion"
              v-model="anneePromotion"
              type="number"
              required
              min="2020"
              max="2030"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ isLogin ? 'Se connecter' : 'S\'inscrire' }}
          </button>
        </div>

        <div class="text-sm text-center">
          <a
            href="#"
            @click.prevent="isLogin = !isLogin"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            {{ isLogin ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter' }}
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../config/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const estEtudiant = ref(false)
const prenom = ref('')
const nom = ref('')
const anneePromotion = ref(new Date().getFullYear())

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      // Connexion
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      
      if (error) throw error
      
      router.push('/')
    } else {
      // Inscription
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      
      if (authError) throw authError

      // Création du profil utilisateur
      const { error: profileError } = await supabase
        .from('utilisateurs')
        .insert([
          {
            id: authData.user.id,
            email: email.value,
            estEtudiant: estEtudiant.value,
          }
        ])

      if (profileError) throw profileError

      if (estEtudiant.value) {
        const { error: studentError } = await supabase
          .from('profils')
          .insert([
            {
              idUtilisateur: authData.user.id,
              prenom: prenom.value,
              nom: nom.value,
              anneePromotion: anneePromotion.value,
            }
          ])

        if (studentError) throw studentError
      }

      router.push('/')
    }
  } catch (error) {
    console.error('Erreur:', error.message)
    alert(error.message)
  }
}
</script>
