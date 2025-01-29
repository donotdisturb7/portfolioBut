<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
       style="background-image: url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;">
    <div class="max-w-md w-full space-y-8 bg-white/90 p-8 rounded-lg shadow-lg backdrop-blur-sm">
      <div class="flex justify-center">
        <h2 class="text-4xl font-bold text-center text-gray-700">Inscription</h2>
        <p class="mt-3 text-gray-500">Créez votre compte</p>
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
            <label class="block mb-2 text-sm text-gray-600">Type de compte</label>
            <div class="mt-2 space-x-6">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="estEtudiant"
                  :value="true"
                  class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-gray-700">Étudiant</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="estEtudiant"
                  :value="false"
                  class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="ml-2 text-gray-700">Visiteur</span>
              </label>
            </div>
          </div>

          <template v-if="estEtudiant">
            <div class="mt-6">
              <label for="prenom" class="block mb-2 text-sm text-gray-600">Prénom</label>
              <input 
                v-model="prenom"
                type="text"
                id="prenom"
                required
                placeholder="Votre prénom"
                class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div class="mt-6">
              <label for="nom" class="block mb-2 text-sm text-gray-600">Nom</label>
              <input 
                v-model="nom"
                type="text"
                id="nom"
                required
                placeholder="Votre nom"
                class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div class="mt-6">
              <label for="anneePromotion" class="block mb-2 text-sm text-gray-600">Année de promotion</label>
              <select
                v-model="anneePromotion"
                id="anneePromotion"
                required
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              >
                <option value="BUT1">BUT 1</option>
                <option value="BUT2">BUT 2</option>
                <option value="BUT3">BUT 3</option>
              </select>
            </div>
          </template>

          <div class="mt-6">
            <button
              type="submit"
              :disabled="chargement"
              class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              {{ chargement ? 'Création du compte...' : 'Créer un compte' }}
            </button>
          </div>
        </form>

        <div v-if="erreur" class="mt-4 text-center text-red-600">
          {{ erreur }}
        </div>

        <p class="mt-6 text-sm text-center text-gray-400">
          Déjà un compte ?
          <router-link
            to="/login"
            class="text-blue-500 focus:outline-none focus:underline hover:underline"
          >
            Se connecter
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
const estEtudiant = ref(true)
const prenom = ref('')
const nom = ref('')
const anneePromotion = ref('BUT1')
const erreur = ref('')
const chargement = ref(false)

const convertirBUTenAnnee = (but) => {
  const anneeActuelle = new Date().getFullYear()
  const mois = new Date().getMonth() // 0-11
  
  // Si on est après juillet, on considère que c'est la nouvelle année
  const anneeBase = mois >= 7 ? anneeActuelle : anneeActuelle - 1
  
  switch(but) {
    case 'BUT1': return anneeBase + 2
    case 'BUT2': return anneeBase + 1
    case 'BUT3': return anneeBase
    default: return null
  }
}

const handleSubmit = async () => {
  if (estEtudiant.value && (!prenom.value || !nom.value || !anneePromotion.value)) {
    erreur.value = "Veuillez remplir tous les champs obligatoires"
    return
  }

  chargement.value = true
  erreur.value = ''

  try {
    // 1. Vérifier si l'email existe déjà
    const { data: existingUser } = await supabase
      .from("utilisateurs")
      .select("email")
      .eq("email", email.value)
      .single()

    if (existingUser) {
      erreur.value = "Cet email est déjà utilisé"
      return
    }

    // 2. Inscription avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.value,
      password: motDePasse.value,
    })

    if (authError) {
      console.error('Erreur auth:', authError)
      throw authError
    }

    if (!authData.user) {
      throw new Error('Erreur lors de la création du compte')
    }

    // 3. Créer l'utilisateur dans la table utilisateurs
    const { error: userError } = await supabase
      .from("utilisateurs")
      .insert({
        id: authData.user.id,
        email: email.value,
        estEtudiant: estEtudiant.value,
        dateCreation: new Date().toISOString()
      })
      .select()
      .single()

    if (userError) {
      console.error('Erreur création utilisateur:', userError)
      if (userError.code !== '23505') { // code pour duplicate key
        throw userError
      }
    }

    // 4. Si c'est un étudiant, créer son profil
    if (estEtudiant.value) {
      const anneeFinale = convertirBUTenAnnee(anneePromotion.value)
      if (!anneeFinale) {
        throw new Error("Année de promotion invalide")
      }

      // Vérifier si le profil existe déjà
      const { data: existingProfile } = await supabase
        .from("profils")
        .select("idUtilisateur")
        .eq("idUtilisateur", authData.user.id)
        .single()

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from("profils")
          .insert({
            idUtilisateur: authData.user.id,
            prenom: prenom.value,
            nom: nom.value,
            anneePromotion: anneeFinale
          })

        if (profileError) {
          console.error('Erreur création profil:', profileError)
          throw profileError
        }
      }
    }

    // Rediriger vers une page de confirmation
    router.push('/login')
    erreur.value = "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte mail pour activer votre compte."

  } catch (err) {
    console.error('Erreur complète:', err)
    if (err.message) {
      if (err.message.includes('annee_valide')) {
        erreur.value = "L'année de promotion n'est pas valide"
      } else {
        erreur.value = err.message
      }
    } else {
      erreur.value = "Erreur lors de l'inscription. Veuillez réessayer."
    }
  } finally {
    chargement.value = false
  }
}
</script>
