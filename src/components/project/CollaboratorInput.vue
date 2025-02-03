<template>
  <div>
    <label class="mb-1 block text-sm font-medium text-gray-700">Collaborateurs</label>
    <div class="space-y-2">
      <div v-for="(collab, index) in modelValue" :key="index">
        <div class="flex items-center space-x-2">
          <input
            v-model="collab.email"
            type="email"
            placeholder="Email du collaborateur"
            class="flex-grow rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            @blur="searchUser(index)"
          />
          <select
            v-model="collab.role"
            class="rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="collaborator">Collaborateur</option>
            <option value="viewer">Lecteur</option>
          </select>
          <button
            type="button"
            @click="removeCollaborator(index)"
            class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            ×
          </button>
        </div>
        <p v-if="collab.found" class="mt-1 text-sm text-green-600">
          Utilisateur trouvé: {{ collab.username }}
        </p>
        <p v-else-if="collab.found === false" class="mt-1 text-sm text-red-600">
          Utilisateur non trouvé
        </p>
      </div>
    </div>
    <button
      type="button"
      @click="addCollaborator"
      class="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      Ajouter un collaborateur
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { supabase } from '@/supabase'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const addCollaborator = () => {
  const collaborators = [...props.modelValue]
  collaborators.push({ email: '', role: 'collaborator', found: null })
  emit('update:modelValue', collaborators)
}

const removeCollaborator = (index) => {
  const collaborators = [...props.modelValue]
  collaborators.splice(index, 1)
  emit('update:modelValue', collaborators)
}

const searchUser = async (index) => {
  const collaborators = [...props.modelValue]
  const email = collaborators[index].email

  if (!email) {
    collaborators[index].found = null
    emit('update:modelValue', collaborators)
    return
  }

  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('username, email')
      .eq('email', email)
      .single()

    if (error) throw error

    if (users) {
      collaborators[index].found = true
      collaborators[index].username = users.username
    } else {
      collaborators[index].found = false
      collaborators[index].username = null
    }
  } catch (error) {
    console.error('Error searching for user:', error)
    collaborators[index].found = false
    collaborators[index].username = null
  }

  emit('update:modelValue', collaborators)
}
</script>
