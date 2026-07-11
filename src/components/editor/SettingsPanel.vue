<script setup lang="ts">
import type { EmailBlock } from './types'

const props = defineProps<{
  blocks: EmailBlock[]
  selectedBlock: string | null
}>()

const emit = defineEmits<{
  (e: 'updateBlockContent', id: string, value: string): void
  (e: 'updateBlockImage', id: string, value: string): void
  (e: 'updateBlockAlt', id: string, value: string): void
  (e: 'updateBlockColor', id: string, value: string): void
  (e: 'updateBlockColumns', id: string, count: number): void
  (e: 'deleteBlock', id: string): void
}>()

const getBlock = (id: string) => {
  return props.blocks.find(b => b.id === id)
}

const getBlockType = (id: string) => {
  return getBlock(id)?.type || ''
}

const getBlockContent = (id: string) => {
  return getBlock(id)?.content || ''
}

const getBlockImage = (id: string) => {
  return getBlock(id)?.src || ''
}

const getBlockAlt = (id: string) => {
  return getBlock(id)?.alt || ''
}

const getBlockColor = (id: string) => {
  return getBlock(id)?.color || ''
}

const getBlockColumnsCount = (id: string) => {
  const block = getBlock(id)
  return block?.columns?.length || 2
}

const updateBlockContent = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('updateBlockContent', id, target.value)
}

const updateBlockImage = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('updateBlockImage', id, target.value)
}

const updateBlockAlt = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('updateBlockAlt', id, target.value)
}

const updateBlockColor = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('updateBlockColor', id, target.value)
}

const updateBlockColumns = (id: string, event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('updateBlockColumns', id, parseInt(target.value))
}

const deleteBlock = (id: string) => {
  emit('deleteBlock', id)
}
</script>

<template>
  <aside class="settings-panel">
    <h3 class="panel-title">Настройки</h3>
    <p class="panel-subtitle" v-if="!selectedBlock">Выберите блок для редактирования</p>

    <div v-if="selectedBlock" class="settings-content">
      <div class="settings-group">
        <label class="settings-label">Тип блока</label>
        <input class="settings-input" :value="getBlockType(selectedBlock)" disabled />
      </div>

      <!-- Настройки для текстовых блоков -->
      <div class="settings-group" v-if="getBlockType(selectedBlock) === 'text'">
        <label class="settings-label">Текст</label>
        <textarea
          class="settings-textarea"
          :value="getBlockContent(selectedBlock)"
          @input="updateBlockContent(selectedBlock, $event)"
          rows="4"
        ></textarea>
      </div>

      <!-- Настройки для заголовка -->
      <div class="settings-group" v-if="getBlockType(selectedBlock) === 'heading'">
        <label class="settings-label">Текст заголовка</label>
        <input
          class="settings-input"
          :value="getBlockContent(selectedBlock)"
          @input="updateBlockContent(selectedBlock, $event)"
        />
      </div>

      <!-- Настройки для изображения -->
      <div class="settings-group" v-if="getBlockType(selectedBlock) === 'image'">
        <label class="settings-label">URL изображения</label>
        <input
          class="settings-input"
          :value="getBlockImage(selectedBlock)"
          @input="updateBlockImage(selectedBlock, $event)"
          placeholder="https://example.com/image.jpg"
        />
        <label class="settings-label mt-2">Alt текст</label>
        <input
          class="settings-input"
          :value="getBlockAlt(selectedBlock)"
          @input="updateBlockAlt(selectedBlock, $event)"
          placeholder="Описание изображения"
        />
      </div>

      <!-- Настройки для кнопки -->
      <div class="settings-group" v-if="getBlockType(selectedBlock) === 'button'">
        <label class="settings-label">Текст кнопки</label>
        <input
          class="settings-input"
          :value="getBlockContent(selectedBlock)"
          @input="updateBlockContent(selectedBlock, $event)"
        />
        <label class="settings-label mt-2">Цвет кнопки</label>
        <input
          class="settings-input"
          type="color"
          :value="getBlockColor(selectedBlock) || '#4f46e5'"
          @input="updateBlockColor(selectedBlock, $event)"
        />
      </div>

      <!-- Настройки для колонок -->
      <div class="settings-group" v-if="getBlockType(selectedBlock) === 'columns'">
        <label class="settings-label">Количество колонок</label>
        <select
          class="settings-select"
          :value="getBlockColumnsCount(selectedBlock)"
          @change="updateBlockColumns(selectedBlock, $event)"
        >
          <option :value="2">2 колонки</option>
          <option :value="3">3 колонки</option>
        </select>
      </div>

      <button class="delete-block-btn" @click="deleteBlock(selectedBlock)">
        🗑️ Удалить блок
      </button>
    </div>
  </aside>
</template>

<style scoped>
.settings-panel {
  width: 280px;
  background: white;
  padding: 1.5rem;
  overflow-y: auto;
  border-left: 1px solid #e2e8f0;
}

.panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.panel-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.settings-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.settings-input,
.settings-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.settings-input:focus,
.settings-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.settings-input[type="color"] {
  padding: 0.25rem;
  height: 40px;
  cursor: pointer;
}

.settings-textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.settings-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.mt-2 {
  margin-top: 0.5rem;
}

.delete-block-btn {
  padding: 0.5rem 1rem;
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.delete-block-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.settings-panel::-webkit-scrollbar {
  width: 6px;
}

.settings-panel::-webkit-scrollbar-track {
  background: transparent;
}

.settings-panel::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 100px;
}

.settings-panel::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
