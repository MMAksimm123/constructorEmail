<script setup lang="ts">
import { ref } from 'vue'
import { COMPONENTS, type ComponentItem } from './types'

defineProps<{
  blocks: any[]
  selectedBlock: string | null
}>()

const emit = defineEmits<{
  (e: 'dragStart', event: DragEvent, component: ComponentItem): void
  (e: 'selectBlock', id: string): void
  (e: 'reorderBlocks', fromIndex: number, toIndex: number): void
}>()

// ===== DRAG-N-DROP ДЛЯ КОМПОНЕНТОВ =====
const onDragStart = (event: DragEvent, component: ComponentItem) => {
  emit('dragStart', event, component)
}

// ===== DRAG-N-DROP ДЛЯ СЛОЁВ =====
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const onLayerDragStart = (event: DragEvent, index: number) => {
  dragIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

const onLayerDragEnd = () => {
  dragIndex.value = null
  dragOverIndex.value = null
}

const onLayerDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (dragIndex.value !== null && dragIndex.value !== index) {
    dragOverIndex.value = index
  }
}

const onLayerDragEnter = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (dragIndex.value !== null && dragIndex.value !== index) {
    dragOverIndex.value = index
  }
}

const onLayerDragLeave = () => {
  // Не сбрасываем сразу, чтобы не мешать дропу
}

const onLayerDrop = (event: DragEvent, toIndex: number) => {
  event.preventDefault()
  const fromIndex = parseInt(event.dataTransfer?.getData('text/plain') || '-1')

  if (fromIndex !== -1 && fromIndex !== toIndex) {
    emit('reorderBlocks', fromIndex, toIndex)
  }

  dragIndex.value = null
  dragOverIndex.value = null
}

const selectBlock = (id: string) => {
  emit('selectBlock', id)
}

const getComponentIcon = (type: string) => {
  const comp = COMPONENTS.find(c => c.type === type)
  return comp?.icon || '📦'
}
</script>

<template>
  <aside class="components-panel">
    <h3 class="panel-title">Компоненты</h3>
    <p class="panel-subtitle">Перетащите в редактор</p>

    <div class="components-list">
      <div
        v-for="component in COMPONENTS"
        :key="component.type"
        class="component-item"
        draggable="true"
        @dragstart="onDragStart($event, component)"
      >
        <span class="component-icon">{{ component.icon }}</span>
        <span class="component-name">{{ component.name }}</span>
      </div>
    </div>

    <!-- Управление слоями с Drag-n-Drop -->
    <div class="layers-section">
      <h4 class="layers-title">Слои</h4>
      <div class="layers-list">
        <div
          v-for="(item, index) in blocks"
          :key="item.id"
          class="layer-item"
          :class="{
            active: selectedBlock === item.id,
            'dragging': dragIndex === index,
            'drag-over': dragOverIndex === index
          }"
          draggable="true"
          @dragstart="onLayerDragStart($event, index)"
          @dragend="onLayerDragEnd"
          @dragover.prevent="onLayerDragOver($event, index)"
          @dragenter.prevent="onLayerDragEnter($event, index)"
          @dragleave="onLayerDragLeave"
          @drop="onLayerDrop($event, index)"
          @click="selectBlock(item.id)"
        >
          <span class="layer-icon">{{ getComponentIcon(item.type) }}</span>
          <span class="layer-name">{{ item.type }}</span>
          <span class="layer-index">#{{ index + 1 }}</span>
          <span class="layer-drag-handle">⠿</span>
        </div>
        <div v-if="blocks.length === 0" class="layer-empty">
          Нет блоков
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.components-panel {
  width: 280px;
  background: white;
  padding: 1.5rem;
  overflow-y: auto;
  border-right: 1px solid #e2e8f0;
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

.components-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 0.5rem;
  cursor: grab;
  transition: all 0.2s;
}

.component-item:hover {
  border-color: #4f46e5;
  background: #eef2ff;
  transform: translateY(-2px);
}

.component-item:active {
  cursor: grabbing;
}

.component-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.component-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #475569;
}

.layers-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.layers-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.75rem;
}

.layers-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  background: #f8fafc;
  border: 2px solid transparent;
}

.layer-item:hover {
  background: #f1f5f9;
}

.layer-item.active {
  background: #eef2ff;
  border-left: 3px solid #4f46e5;
}

.layer-item.dragging {
  opacity: 0.3;
  transform: scale(0.95);
}

.layer-item.drag-over {
  border-color: #4f46e5;
  background: #eef2ff;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

.layer-icon {
  font-size: 1rem;
}

.layer-name {
  flex: 1;
  font-size: 0.875rem;
  color: #334155;
  text-transform: capitalize;
}

.layer-index {
  font-size: 0.75rem;
  color: #94a3b8;
}

.layer-drag-handle {
  font-size: 1rem;
  color: #cbd5e1;
  cursor: grab;
  padding: 0 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.layer-item:hover .layer-drag-handle {
  opacity: 1;
}

.layer-item:active .layer-drag-handle {
  cursor: grabbing;
}

.layer-empty {
  color: #94a3b8;
  font-size: 0.875rem;
  padding: 0.5rem;
  text-align: center;
}

.components-panel::-webkit-scrollbar {
  width: 6px;
}

.components-panel::-webkit-scrollbar-track {
  background: transparent;
}

.components-panel::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 100px;
}

.components-panel::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
