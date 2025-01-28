import { defineStore } from 'pinia'
import { auth, db } from '../firebase/config'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    utilisateur: null,
    donneesUtilisateur: null,
    profil: null,
    chargement: false,
    erreur: null,
    initialise: false
  }),

  getters: {
    estAuthentifie: (state) => state.utilisateur !== null && state.initialise,
    estEtudiant: (state) => state.profil?.estEtudiant || false,
  },

  actions: {
    async initialiser() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (utilisateur) => {
          if (utilisateur) {
            // Stocker les données d'authentification Firebase
            this.utilisateur = {
              uid: utilisateur.uid,
              email: utilisateur.email,
              displayName: utilisateur.displayName,
              photoURL: utilisateur.photoURL
            }

            // Récupérer les données supplémentaires de Firestore
            const docUtilisateur = await getDoc(doc(db, 'utilisateurs', utilisateur.uid))
            const docProfil = await getDoc(doc(db, 'profils', utilisateur.uid))
            
            if (docUtilisateur.exists()) {
              this.donneesUtilisateur = docUtilisateur.data()
            }
            
            if (docProfil.exists()) {
              this.profil = docProfil.data()
            }
          } else {
            this.utilisateur = null
            this.donneesUtilisateur = null
            this.profil = null
          }
          this.initialise = true
          resolve()
        })
      })
    },

    async inscription({ email, motDePasse, estEtudiant, prenom, nom, anneePromotion }) {
      this.chargement = true
      this.erreur = null
      
      try {
        // Créer l'utilisateur dans Firebase Auth
        const credentiels = await createUserWithEmailAndPassword(auth, email, motDePasse)
        
        // Créer le document utilisateur dans Firestore
        const donneesUtilisateur = {
          id: credentiels.user.uid,
          email,
          prenom,
          nom,
          estEtudiant,
          dateCreation: new Date().toISOString()
        }
        
        // Créer le document profil dans Firestore
        const donneesProfil = {
          id: credentiels.user.uid,
          email,
          prenom,
          nom,
          estEtudiant,
          anneePromotion: estEtudiant ? anneePromotion : null,
          avatar: null,
          dateCreation: new Date().toISOString()
        }
        
        // Sauvegarder dans Firestore
        await setDoc(doc(db, 'utilisateurs', credentiels.user.uid), donneesUtilisateur)
        await setDoc(doc(db, 'profils', credentiels.user.uid), donneesProfil)
        
        // Mettre à jour le state
        this.utilisateur = {
          uid: credentiels.user.uid,
          email: credentiels.user.email,
          displayName: credentiels.user.displayName,
          photoURL: credentiels.user.photoURL
        }
        this.donneesUtilisateur = donneesUtilisateur
        this.profil = donneesProfil
        
      } catch (erreur) {
        console.error('Erreur lors de l\'inscription:', erreur)
        switch (erreur.code) {
          case 'auth/email-already-in-use':
            this.erreur = 'Cette adresse email est déjà utilisée'
            break
          case 'auth/invalid-email':
            this.erreur = 'Adresse email invalide'
            break
          case 'auth/operation-not-allowed':
            this.erreur = 'L\'inscription par email n\'est pas activée'
            break
          case 'auth/weak-password':
            this.erreur = 'Le mot de passe doit contenir au moins 6 caractères'
            break
          default:
            this.erreur = 'Une erreur est survenue lors de l\'inscription'
        }
        throw erreur
      } finally {
        this.chargement = false
      }
    },

    async connexion({ email, motDePasse }) {
      this.chargement = true
      this.erreur = null

      try {
        const credentiels = await signInWithEmailAndPassword(auth, email, motDePasse)
        
        // Récupérer les données depuis Firestore
        const docUtilisateur = await getDoc(doc(db, 'utilisateurs', credentiels.user.uid))
        const docProfil = await getDoc(doc(db, 'profils', credentiels.user.uid))
        
        if (docUtilisateur.exists()) {
          this.donneesUtilisateur = docUtilisateur.data()
        }
        
        if (docProfil.exists()) {
          this.profil = docProfil.data()
        }
        
        // Mettre à jour le state
        this.utilisateur = {
          uid: credentiels.user.uid,
          email: credentiels.user.email,
          displayName: credentiels.user.displayName,
          photoURL: credentiels.user.photoURL
        }
        
      } catch (erreur) {
        console.error('Erreur lors de la connexion:', erreur)
        switch (erreur.code) {
          case 'auth/invalid-email':
            this.erreur = 'Adresse email invalide'
            break
          case 'auth/user-disabled':
            this.erreur = 'Ce compte a été désactivé'
            break
          case 'auth/user-not-found':
            this.erreur = 'Aucun compte ne correspond à cette adresse email'
            break
          case 'auth/wrong-password':
            this.erreur = 'Mot de passe incorrect'
            break
          default:
            this.erreur = 'Une erreur est survenue lors de la connexion'
        }
        throw erreur
      } finally {
        this.chargement = false
      }
    },

    async deconnexion() {
      try {
        await signOut(auth)
        this.utilisateur = null
        this.donneesUtilisateur = null
        this.profil = null
      } catch (erreur) {
        console.error('Erreur lors de la déconnexion:', erreur)
        this.erreur = 'Une erreur est survenue lors de la déconnexion'
        throw erreur
      }
    }
  }
})
