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
          <!-- Indicateur de progression -->
          <div class="mb-8">
            <div class="flex justify-between mb-4">
              <span class="text-sm font-medium px-4" :class="{'text-blue-600': etape >= 1, 'text-gray-500': etape < 1}">
                Informations personnelles
              </span>
              <span class="text-sm font-medium px-4" :class="{'text-blue-600': etape >= 2, 'text-gray-500': etape < 2}">
                Type de compte
              </span>
              <span class="text-sm font-medium px-4" :class="{'text-blue-600': etape >= 3, 'text-gray-500': etape < 3}">
                Créer votre compte
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                   :style="{ width: ((etape - 1) * 50) + '%' }"></div>
            </div>
          </div>

          <h1 class="text-2xl font-bold text-gray-900 mb-8">
            {{ etapeTitres[etape - 1] }}
          </h1>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Étape 1: Informations personnelles -->
            <div v-if="etape === 1">
              <div class="space-y-6">
                <div>
                  <label for="prenom" class="block text-sm font-medium text-gray-900 mb-2">Prénom</label>
                  <input 
                    v-model="prenom"
                    type="text" 
                    id="prenom" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="Votre prénom" 
                    required
                  >
                </div>

                <div>
                  <label for="nom" class="block text-sm font-medium text-gray-900 mb-2">Nom</label>
                  <input 
                    v-model="nom"
                    type="text" 
                    id="nom" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="Votre nom" 
                    required
                  >
                </div>
              </div>
            </div>

            <!-- Étape 2: Type de compte -->
            <div v-if="etape === 2">
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-4">Type de compte</label>
                  <div class="grid grid-cols-2 gap-4">
                    <div 
                      class="p-4 border rounded-lg cursor-pointer transition-all"
                      :class="{'border-blue-500 bg-blue-50': estEtudiant, 'border-gray-200 hover:border-blue-200': !estEtudiant}"
                      @click="estEtudiant = true"
                    >
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 rounded-full border-2"
                             :class="{'border-blue-500 bg-blue-500': estEtudiant, 'border-gray-300': !estEtudiant}"></div>
                        <span class="font-medium" :class="{'text-blue-600': estEtudiant, 'text-gray-700': !estEtudiant}">Étudiant</span>
                      </div>
                    </div>
                    <div 
                      class="p-4 border rounded-lg cursor-pointer transition-all"
                      :class="{'border-blue-500 bg-blue-50': !estEtudiant, 'border-gray-200 hover:border-blue-200': estEtudiant}"
                      @click="estEtudiant = false"
                    >
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 rounded-full border-2"
                             :class="{'border-blue-500 bg-blue-500': !estEtudiant, 'border-gray-300': estEtudiant}"></div>
                        <span class="font-medium" :class="{'text-blue-600': !estEtudiant, 'text-gray-700': estEtudiant}">Visiteur</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="estEtudiant">
                  <label for="anneePromotion" class="block text-sm font-medium text-gray-900 mb-2">Année de promotion</label>
                  <select 
                    v-model="anneePromotion"
                    id="anneePromotion"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  >
                    <option value="">Sélectionnez votre année</option>
                    <option value="BUT1">BUT 1</option>
                    <option value="BUT2">BUT 2</option>
                    <option value="BUT3">BUT 3</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Étape 3: Informations de connexion -->
            <div v-if="etape === 3">
              <div class="space-y-6">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <input 
                    v-model="email"
                    type="email" 
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
                    id="motDePasse" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="••••••••" 
                    required
                  >
                </div>

                <div>
                  <label for="confirmMotDePasse" class="block text-sm font-medium text-gray-900 mb-2">Confirmer le mot de passe</label>
                  <input 
                    v-model="confirmMotDePasse"
                    type="password" 
                    id="confirmMotDePasse" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="••••••••" 
                    required
                  >
                </div>
              </div>
            </div>

            <div v-if="erreur" class="text-center text-sm text-red-600 mt-2">
              {{ erreur }}
            </div>

            <div v-if="succes" class="text-center text-sm text-green-600 mt-2">
              {{ succes }}
            </div>

            <div class="flex justify-between space-x-4">
              <button 
                type="button"
                v-if="etape > 1"
                @click="etapePrecedente"
                class="flex-1 px-5 py-2.5 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                Précédent
              </button>

              <button 
                type="submit"
                :disabled="chargement"
                class="flex-1 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {{ chargement ? 'Inscription...' : "S'inscrire" }}
              </button>
            </div>

            <p class="text-sm text-center text-gray-500 mt-4">
              Déjà un compte? 
              <router-link to="/login" class="font-medium text-blue-600 hover:underline">
                Se connecter
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

// État des étapes
const etape = ref(1)
const etapeTitres = [
  'Informations personnelles',
  'Type de compte',
  'Créer votre compte'
]

// Formulaire
const email = ref('')
const motDePasse = ref('')
const confirmMotDePasse = ref('')
const estEtudiant = ref(true)
const prenom = ref('')
const nom = ref('')
const anneePromotion = ref('BUT1')
const erreur = ref('')
const succes = ref('')
const chargement = ref(false)

const convertirBUTenAnnee = (but) => {
  const anneeActuelle = new Date().getFullYear()
  const mois = new Date().getMonth()
  const anneeBase = mois >= 7 ? anneeActuelle : anneeActuelle - 1
  
  switch(but) {
    case 'BUT1': return anneeBase + 2
    case 'BUT2': return anneeBase + 1
    case 'BUT3': return anneeBase
    default: return null
  }
}

const etapeSuivante = () => {
  erreur.value = ''
  succes.value = ''

  if (etape.value === 1) {
    if (!prenom.value || !nom.value) {
      erreur.value = "Veuillez remplir tous les champs"
      return
    }
    etape.value++
  } 
  else if (etape.value === 2) {
    if (estEtudiant.value && !anneePromotion.value) {
      erreur.value = "Veuillez sélectionner votre année de promotion"
      return
    }
    etape.value++
  }
}

const etapePrecedente = () => {
  erreur.value = ''
  succes.value = ''
  etape.value--
}

const handleSubmit = async () => {
  if (etape.value < 3) {
    etapeSuivante()
    return
  }

  // Validation des champs
  if (!email.value || !motDePasse.value || !confirmMotDePasse.value) {
    erreur.value = "Veuillez remplir tous les champs"
    return
  }

  // Validation du mot de passe
  const passwordError = validatePassword(motDePasse.value)
  if (passwordError) {
    erreur.value = passwordError
    return
  }

  // Validation de l'email
  const emailError = validateEmail(email.value)
  if (emailError) {
    erreur.value = emailError
    return
  }

  if (motDePasse.value !== confirmMotDePasse.value) {
    erreur.value = "Les mots de passe ne correspondent pas"
    return
  }

  chargement.value = true
  erreur.value = ''

  try {
    // Vérifier si l'email existe déjà
    const { data: existingUser } = await supabase
      .from("utilisateurs")
      .select("email")
      .eq("email", email.value)
      .single()

    if (existingUser) {
      erreur.value = "Cet email est déjà utilisé"
      return
    }

    // Inscription avec Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: motDePasse.value,
      options: {
        data: {
          prenom: prenom.value,
          nom: nom.value,
          estEtudiant: estEtudiant.value,
          anneePromotion: estEtudiant.value ? anneePromotion.value : null
        }
      }
    })

    if (error) {
      // Traduire les messages d'erreur de Supabase
      if (error.message.includes('Password should be at least 6 characters')) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères')
      } else if (error.message.includes('Email address') && error.message.includes('is invalid')) {
        throw new Error('Adresse email invalide')
      } else if (error.message.includes('User already registered')) {
        throw new Error('Cet email est déjà utilisé')
      } else {
        // Log l'erreur pour le débogage
        console.error('Message d\'erreur Supabase original:', error.message)
        throw new Error('Une erreur est survenue lors de l\'inscription')
      }
    }

    // Créer l'utilisateur dans la table utilisateurs
    const { error: userError } = await supabase
      .from("utilisateurs")
      .insert({
        id: data.user.id,
        email: email.value,
        estEtudiant: estEtudiant.value,
        dateCreation: new Date().toISOString()
      })

    if (userError && userError.code !== '23505') throw userError

    // Si c'est un étudiant, créer son profil
    if (estEtudiant.value) {
      const anneeFinale = convertirBUTenAnnee(anneePromotion.value)
      if (!anneeFinale) throw new Error("Année de promotion invalide")

      const { error: profileError } = await supabase
        .from("profils")
        .insert({
          idUtilisateur: data.user.id,
          prenom: prenom.value,
          nom: nom.value,
          anneePromotion: anneeFinale
        })

      if (profileError) throw profileError
    }

    succes.value = "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte mail pour activer votre compte."
    setTimeout(() => {
      router.push('/login')
    }, 3000)

  } catch (err) {
    console.error('Erreur:', err)
    erreur.value = err.message || "Une erreur est survenue lors de l'inscription"
  } finally {
    chargement.value = false
  }
}

const validatePassword = (password) => {
  if (password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères'
  }
  return null
}

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return 'Format d\'email invalide'
  }
  return null
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>