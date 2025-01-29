import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/config/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)

  // Getters
  const isAuthenticated = computed(() => user.value !== null)
  const isStudent = computed(() => profile.value?.estEtudiant ?? false)
  const fullName = computed(() => {
    if (!profile.value || !profile.value.prenom || !profile.value.nom) return 'Visiteur'
    return `${profile.value.prenom} ${profile.value.nom}`
  })

  // Actions
  const fetchProfile = async (userId) => {
    try {
      // Récupérer les informations de l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from('utilisateurs')
        .select('*, profils(*)')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      profile.value = {
        ...userData,
        ...userData.profils,
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      profile.value = null
    }
  }

  const initialize = async () => {
    try {
      loading.value = true
      
      // Vérifier la session actuelle
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        user.value = session.user
        await fetchProfile(session.user.id)
      }

      // Écouter les changements d'authentification
      supabase.auth.onAuthStateChange(async (event, session) => {
        user.value = session?.user || null
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          profile.value = null
        }
      })
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    user.value = data.user
    await fetchProfile(data.user.id)
  }

  const register = async ({ email, password, prenom, nom, anneePromotion }) => {
    // 1. Créer le compte auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError) throw authError

    // 2. Créer le profil utilisateur
    const { error: userError } = await supabase
      .from('utilisateurs')
      .insert([{
        id: authData.user.id,
        email,
        estEtudiant: true
      }])

    if (userError) throw userError

    // 3. Créer le profil étudiant
    const { error: profileError } = await supabase
      .from('profils')
      .insert([{
        idUtilisateur: authData.user.id,
        prenom,
        nom,
        anneePromotion: parseInt(anneePromotion)
      }])

    if (profileError) throw profileError

    user.value = authData.user
    await fetchProfile(authData.user.id)
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    user.value = null
    profile.value = null
  }

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    isStudent,
    fullName,
    initialize,
    login,
    register,
    logout
  }
})
