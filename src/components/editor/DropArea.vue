<template>
  <main class="drop-area" @dragover.prevent @drop="onDrop">
    <div class="email-preview">
      <div class="email-header">
        <span>📧 Превью письма</span>
        <span class="email-width">600px</span>
      </div>

      <div class="email-content">
        <EmailBlock
          v-for="block in blocks"
          :key="block.id"
          :block="block"
          :selected="selectedBlock === block.id"
          @select="selectBlock(block.id)"
          @delete="deleteBlock(block.id)"
          @update-content="(content) => updateBlockContent(block.id, content)"
          @update-column="(payload) => updateBlockColumn(block.id, payload.columnIndex, payload.content)"
        />

        <!-- Пустое состояние -->
        <div v-if="blocks.length === 0" class="empty-drop-area">
          <div class="empty-icon">📋</div>
          <p>Перетащите компоненты сюда</p>
          <p class="empty-hint">или нажмите на блок для редактирования</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import EmailBlock from './EmailBlock.vue'
import type { EmailBlock as EmailBlockType } from './types'

defineProps<{
  blocks: EmailBlockType[]
  selectedBlock: string | null
}>()

const emit = defineEmits<{
  (e: 'drop', event: DragEvent): void
  (e: 'selectBlock', id: string): void
  (e: 'deleteBlock', id: string): void
  (e: 'updateBlockContent', id: string, content: string): void
  (e: 'updateBlockColumn', id: string, columnIndex: number, content: string): void
}>()

const onDrop = (event: DragEvent) => {
  emit('drop', event)
}

const selectBlock = (id: string) => {
  emit('selectBlock', id)
}

const deleteBlock = (id: string) => {
  emit('deleteBlock', id)
}

const updateBlockContent = (id: string, content: string) => {
  emit('updateBlockContent', id, content)
}

const updateBlockColumn = (id: string, columnIndex: number, content: string) => {
  emit('updateBlockColumn', id, columnIndex, content)
}
</script>

<style scoped>
.drop-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #f1f5f9;
}

.email-preview {
  max-width: 660px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.email-header {
  padding: 0.75rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #64748b;
}

.email-width {
  font-weight: 500;
  color: #94a3b8;
}

.email-content {
  padding: 1.5rem;
  min-height: 400px;
}

.empty-drop-area {
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
}

.empty-drop-area .empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-drop-area p {
  margin: 0.25rem 0;
  font-size: 1.125rem;
}

.empty-drop-area .empty-hint {
  font-size: 0.875rem;
  color: #cbd5e1;
}

.drop-area::-webkit-scrollbar {
  width: 6px;
}

.drop-area::-webkit-scrollbar-track {
  background: transparent;
}

.drop-area::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 100px;
}

.drop-area::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
