<script setup lang="ts">
import EditorLayout from '../components/editor/EditorLayout.vue'

defineProps<{
  name?: string
}>()
</script>

<template>
  <EditorLayout :initial-name="name" />
</template>
