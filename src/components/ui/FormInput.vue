<template>
  <div class="form-group">
    <label :for="id" class="block text-sm font-medium text-gray-900 mb-2">
      {{ label }}
    </label>
    <input 
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      :placeholder="placeholder"
      :required="required"
      @blur="validate"
    >
    <span v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  validation: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'validation'])

const error = ref('')

const validate = () => {
  if (props.validation) {
    const validationResult = props.validation(props.modelValue)
    error.value = typeof validationResult === 'string' ? validationResult : ''
    emit('validation', !error.value)
  }
}

watch(() => props.modelValue, () => {
  if (error.value) validate()
})
</script>
