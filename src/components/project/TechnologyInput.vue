<template>
  <div>
    <label class="mb-1 block text-sm font-medium text-gray-700">Technologies</label>
    <div class="flex items-center space-x-2">
      <input
        v-model="technologyInput"
        type="text"
        placeholder="Ajouter une technologie"
        class="flex-grow rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
        @keyup.enter.prevent="addTechnology"
      />
      <button
        type="button"
        @click="addTechnology"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        +
      </button>
    </div>
    <div class="mt-2 flex flex-wrap gap-2">
      <span
        v-for="(tech, index) in modelValue"
        :key="index"
        class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
      >
        {{ tech }}
        <button
          type="button"
          @click="removeTechnology(index)"
          class="ml-2 text-blue-600 hover:text-blue-800"
        >
          ×
        </button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const technologyInput = ref('')

const addTechnology = () => {
  if (technologyInput.value.trim()) {
    const technologies = [...props.modelValue]
    technologies.push(technologyInput.value.trim())
    emit('update:modelValue', technologies)
    technologyInput.value = ''
  }
}

const removeTechnology = (index) => {
  const technologies = [...props.modelValue]
  technologies.splice(index, 1)
  emit('update:modelValue', technologies)
}
</script>
