<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  initialName?: string
  blocks: any[]
}>()

const emit = defineEmits<{
  (e: 'loadBlocks', blocks: any[], name: string): void
  (e: 'saveBlocks', name: string): void
  (e: 'send'): void
}>()

const router = useRouter()
const projectName = ref(props.initialName || '')
const selectedProject = ref('')
const savedProjects = ref<Record<string, any[]>>({})

const projectNames = computed(() => Object.keys(savedProjects.value))

const loadProjectsList = () => {
  try {
    const data = localStorage.getItem('email_projects')
    savedProjects.value = data ? JSON.parse(data) : {}
  } catch {
    savedProjects.value = {}
  }
}

const saveProjectsList = () => {
  localStorage.setItem('email_projects', JSON.stringify(savedProjects.value))
}

const saveProject = () => {
  if (!projectName.value.trim()) {
    alert('Введите название макета')
    return
  }
  const name = projectName.value.trim()
  savedProjects.value[name] = JSON.parse(JSON.stringify(props.blocks))
  saveProjectsList()
  router.replace({ name: 'editor', params: { name } })
  emit('saveBlocks', name)
  alert(`Макет "${name}" сохранён!`)
}

const loadSelectedProject = () => {
  if (selectedProject.value) {
    loadProject(selectedProject.value)
  }
}

const loadProject = (name: string) => {
  const blocks = savedProjects.value[name]
  if (blocks) {
    emit('loadBlocks', blocks, name)
    projectName.value = name
    selectedProject.value = name
    router.replace({ name: 'editor', params: { name } })
  }
}

const deleteSelectedProject = () => {
  if (!selectedProject.value) return
  if (confirm(`Удалить макет "${selectedProject.value}"?`)) {
    delete savedProjects.value[selectedProject.value]
    saveProjectsList()
    selectedProject.value = ''
    if (projectName.value === selectedProject.value) {
      projectName.value = ''
    }
    loadProjectsList()
  }
}

onMounted(() => {
  loadProjectsList()
  if (props.initialName && savedProjects.value[props.initialName]) {
    loadProject(props.initialName)
  }
})

watch(() => props.blocks, () => {}, { deep: true })
</script>

<template>
  <div class="save-bar">
    <div class="save-bar-content">
      <div class="save-bar-left">
        <input
          v-model="projectName"
          class="project-name-input"
          placeholder="Название макета"
          @keydown.enter="saveProject"
        />
        <button class="save-btn" @click="saveProject">💾 Сохранить</button>
        <button class="send-btn" @click="emit('send')">📤 Отправить</button>
      </div>
      <div class="save-bar-right">
        <select v-model="selectedProject" class="project-select" @change="loadSelectedProject">
          <option value="">-- Загрузить макет --</option>
          <option v-for="name in projectNames" :key="name" :value="name">{{ name }}</option>
        </select>
        <button v-if="selectedProject" class="delete-project-btn" @click="deleteSelectedProject">🗑️</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.save-bar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem 2rem;
}
.save-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.save-bar-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.save-bar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.project-name-input {
  padding: 0.375rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-width: 200px;
}
.project-name-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
.save-btn, .save-as-btn, .send-btn {
  padding: 0.375rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.save-btn {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
}
.save-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}
.save-as-btn {
  background: #f1f5f9;
  color: #334155;
}
.save-as-btn:hover {
  background: #e2e8f0;
}
.send-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}
.send-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
.project-select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-width: 160px;
  background: white;
}
.project-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
.delete-project-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #ef4444;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}
.delete-project-btn:hover {
  background: #fee2e2;
}
</style>
