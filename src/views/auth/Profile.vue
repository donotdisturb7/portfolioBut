<template>
    <div>
        <h1> {{ authStore.fullName }}</h1>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>