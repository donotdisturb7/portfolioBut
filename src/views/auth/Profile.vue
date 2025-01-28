<template>
    <div>
        <h1>Profile</h1>
        <div>
            Prenom : {{ authStore.utilisateur?.prenom }}
            <br>
            Nom : {{ authStore.utilisateur?.nom }}
        </div>
    </div>
</template> 

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
