<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { generateHTML } from '../utils/emailGenerator'

// ===== EMITS =====
const emit = defineEmits<{
  (e: 'update:count', count: number): void
}>()

// ===== СОСТОЯНИЕ =====
const savedProjects = ref<Record<string, any[]>>({})

// ===== ВЫЧИСЛЯЕМЫЕ СВОЙСТВА =====
const savedProjectNames = computed(() => Object.keys(savedProjects.value))

// ===== МЕТОДЫ =====
const loadSavedProjects = () => {
  try {
    const data = localStorage.getItem('email_projects')
    if (data) {
      savedProjects.value = JSON.parse(data)
    } else {
      savedProjects.value = {}
    }
  } catch (e) {
    savedProjects.value = {}
  }
  emit('update:count', savedProjectNames.value.length)
}

const deleteSavedProject = (name: string) => {
  if (confirm(`Удалить макет "${name}"?`)) {
    delete savedProjects.value[name]
    localStorage.setItem('email_projects', JSON.stringify(savedProjects.value))
    loadSavedProjects()
  }
}

const getBlocksCount = (name: string): number => {
  const blocks = savedProjects.value[name]
  return blocks ? blocks.length : 0
}

const getProjectDate = (name: string): string => {
  return new Date().toISOString()
}

const getPreviewText = (name: string): string => {
  const blocks = savedProjects.value[name]
  if (!blocks || blocks.length === 0) return 'Пустой макет'
  const firstBlock = blocks[0]
  if (firstBlock.type === 'text' || firstBlock.type === 'heading' || firstBlock.type === 'button') {
    return firstBlock.content || 'Без содержимого'
  }
  if (firstBlock.type === 'image') {
    return '🖼️ Изображение'
  }
  if (firstBlock.type === 'divider') {
    return '➖ Разделитель'
  }
  if (firstBlock.type === 'columns') {
    return `📊 ${firstBlock.columns?.length || 2} колонки`
  }
  return 'Блок'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const sendEmail = (name: string) => {
  const blocks = savedProjects.value[name]
  if (!blocks) return
  const html = generateHTML(blocks)
  const newWindow = window.open('', '_blank', 'width=800,height=600')
  if (newWindow) {
    newWindow.document.write(html)
    newWindow.document.close()
    setTimeout(() => {
      alert('📧 Скопируйте содержимое письма и вставьте в ваш почтовый клиент')
    }, 500)
  }
}

// ===== СЛУШАЕМ ИЗМЕНЕНИЯ localStorage (синхронизация между вкладками) =====
const handleStorageChange = (e: StorageEvent) => {
  if (e.key === 'email_projects') {
    loadSavedProjects()
  }
}

// ===== СЛЕДИМ ЗА ИЗМЕНЕНИЯМИ savedProjects =====
watch(savedProjects, () => {
  emit('update:count', savedProjectNames.value.length)
}, { deep: true })

// ===== MOUNT =====
onMounted(() => {
  loadSavedProjects()
  window.addEventListener('storage', handleStorageChange)
})
</script>

<template>
  <div class="projects-container">
    <!-- ===== ЗАГОЛОВОК ===== -->
    <div class="projects-header">
      <div>
        <h2 class="projects-title">
          <span class="gradient-text">Мои макеты</span>
          <span class="projects-count">{{ savedProjectNames.length }}</span>
        </h2>
        <p class="projects-subtitle">Ваши сохранённые email-макеты</p>
      </div>
    </div>

    <!-- ===== ПУСТОЕ СОСТОЯНИЕ ===== -->
    <div v-if="savedProjectNames.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p class="empty-title">Нет сохранённых макетов</p>
      <p class="empty-description">Создайте свой первый макет прямо сейчас!</p>
      <router-link to="/editor" class="empty-create-btn">
        ➕ Создать макет
      </router-link>
    </div>

    <!-- ===== СПИСОК МАКЕТОВ ===== -->
    <div class="projects-grid">
      <div
        v-for="name in savedProjectNames"
        :key="name"
        class="project-card"
      >
        <div class="card-content">
          <div class="card-header">
            <div class="card-info">
              <div class="card-avatar">
                {{ name.charAt(0).toUpperCase() }}
              </div>
              <div class="card-details">
                <h3 class="card-title" :title="name">
                  {{ name }}
                </h3>
                <p class="card-date">
                  📅 {{ formatDate(getProjectDate(name)) }}
                </p>
                <p class="card-blocks-count">
                  🧩 {{ getBlocksCount(name) }} блоков
                </p>
              </div>
            </div>
            <button
              @click="deleteSavedProject(name)"
              class="delete-button"
              title="Удалить макет"
            >
              <svg class="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div class="card-preview">
            <span v-if="getBlocksCount(name) === 0" class="preview-empty">Пустой макет</span>
            <span v-else class="preview-text">
              {{ getPreviewText(name) }}
            </span>
          </div>

          <div class="card-footer">
            <span class="card-status">
              <span class="status-indicator"></span>
              Готов к использованию
            </span>
            <div class="card-actions">
              <router-link :to="`/editor/${name}`" class="card-link">
                Открыть
                <span class="card-arrow">→</span>
              </router-link>
              <button @click="sendEmail(name)" class="send-btn" title="Отправить письмо">
                📤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-container {
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.projects-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

@media (min-width: 640px) {
  .projects-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.projects-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .projects-title {
    font-size: 2.5rem;
  }
}

.projects-count {
  font-size: 0.875rem;
  font-weight: 400;
  background: rgba(241, 245, 249, 0.8);
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  color: #64748b;
  border: 1px solid rgba(203, 213, 225, 0.3);
}

.projects-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
}

.create-button {
  cursor: pointer;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  font-weight: 500;
  padding: 0.75rem 2rem;
  border-radius: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
}

.create-button:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.3);
}

.create-icon {
  font-size: 1.25rem;
}

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 4.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #334155;
}

.empty-description {
  color: #94a3b8;
  margin-top: 0.5rem;
  font-size: 1.125rem;
}

.empty-create-btn {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border-radius: 1rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
}

.empty-create-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.3);
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 640px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .projects-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.project-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-0.5rem) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.08);
  border-color: rgba(165, 180, 252, 0.3);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}

.card-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.card-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #818cf8, #7c3aed);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
}

.card-details {
  flex: 1;
  min-width: 0;
  padding-top: 0.125rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-date {
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.card-blocks-count {
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.125rem;
}

.delete-button {
  color: #cbd5e1;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.delete-button:hover {
  color: #f87171;
  transform: scale(1.1);
}

.delete-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.card-preview {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(241, 245, 249, 0.5);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 2.5rem;
}

.preview-empty {
  color: #94a3b8;
  font-style: italic;
}

.preview-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(203, 213, 225, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #94a3b8;
}

.status-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-link {
  color: #94a3b8;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  text-decoration: none;
}

.project-card:hover .card-link {
  color: #4f46e5;
}

.card-arrow {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
  display: inline-block;
}

.project-card:hover .card-arrow {
  transform: translateX(0.25rem);
}

.send-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.send-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
</style>
