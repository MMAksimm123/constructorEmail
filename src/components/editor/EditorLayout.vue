<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import ComponentsPanel from './ComponentsPanel.vue'
import DropArea from './DropArea.vue'
import SettingsPanel from './SettingsPanel.vue'
import SaveProjectBar from './SaveProjectBar.vue'
import { generateHTML } from '../../utils/emailGenerator'
import type { EmailBlock, ComponentItem } from './types'

const props = defineProps<{
  initialName?: string
}>()

const route = useRoute()

const blocks = ref<EmailBlock[]>([])
const selectedBlock = ref<string | null>(null)
const projectName = ref(props.initialName || 'Без названия')

const loadBlocks = (loadedBlocks: EmailBlock[], name: string) => {
  blocks.value = loadedBlocks
  selectedBlock.value = null
  projectName.value = name
}

const handleSave = (name: string) => {
  projectName.value = name
}

// ===== ФУНКЦИЯ ОТПРАВКИ (как в ProjectsList) =====
const sendEmail = () => {
  const html = generateHTML(blocks.value)
  const newWindow = window.open('', '_blank', 'width=800,height=600')
  if (newWindow) {
    newWindow.document.write(html)
    newWindow.document.close()
    setTimeout(() => {
      alert('📧 Скопируйте содержимое письма и вставьте в ваш Gmail')
    }, 500)
  }
}

// Остальная логика (drag-n-drop, управление блоками) остаётся без изменений
const addBlock = (type: string) => {
  const newBlock: EmailBlock = {
    id: `block-${Date.now()}-${Math.random()}`,
    type,
  }
  switch (type) {
    case 'text':
      newBlock.content = 'Введите ваш текст здесь...'
      break
    case 'heading':
      newBlock.content = 'Заголовок'
      break
    case 'image':
      newBlock.src = ''
      newBlock.alt = 'Изображение'
      break
    case 'button':
      newBlock.content = 'Кнопка'
      newBlock.color = '#4f46e5'
      break
    case 'columns':
      newBlock.columns = [
        { content: 'Колонка 1' },
        { content: 'Колонка 2' },
      ]
      break
  }
  blocks.value.push(newBlock)
  selectedBlock.value = newBlock.id
}

const deleteBlock = (id: string) => {
  const index = blocks.value.findIndex(b => b.id === id)
  if (index !== -1) {
    blocks.value.splice(index, 1)
    if (selectedBlock.value === id) {
      selectedBlock.value = null
    }
  }
}

const selectBlock = (id: string) => {
  selectedBlock.value = id
}

const updateBlockContent = (id: string, value: string) => {
  const block = blocks.value.find(b => b.id === id)
  if (block) block.content = value
}

const updateBlockColumn = (id: string, columnIndex: number, value: string) => {
  const block = blocks.value.find(b => b.id === id)
  if (block && block.columns && block.columns[columnIndex]) {
    block.columns[columnIndex].content = value
  }
}

const updateBlockImage = (id: string, value: string) => {
  const block = blocks.value.find(b => b.id === id)
  if (block) block.src = value
}

const updateBlockAlt = (id: string, value: string) => {
  const block = blocks.value.find(b => b.id === id)
  if (block) block.alt = value
}

const updateBlockColor = (id: string, value: string) => {
  const block = blocks.value.find(b => b.id === id)
  if (block) block.color = value
}

const updateBlockColumns = (id: string, count: number) => {
  const block = blocks.value.find(b => b.id === id)
  if (block) {
    const currentCount = block.columns?.length || 0
    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        block.columns?.push({ content: `Колонка ${i + 1}` })
      }
    } else if (count < currentCount) {
      block.columns = block.columns?.slice(0, count)
    }
  }
}

const onDragStart = (event: DragEvent, component: ComponentItem) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('componentType', component.type)
    event.dataTransfer.effectAllowed = 'copy'
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  const componentType = event.dataTransfer?.getData('componentType')
  if (!componentType) return
  addBlock(componentType)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Delete' && selectedBlock.value) {
    deleteBlock(selectedBlock.value)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="editor-container">
    <SaveProjectBar
      :initial-name="initialName"
      :blocks="blocks"
      @load-blocks="loadBlocks"
      @save-blocks="handleSave"
      @send="sendEmail"
    />
    <div class="editor-body">
      <ComponentsPanel
        :blocks="blocks"
        :selected-block="selectedBlock"
        @drag-start="onDragStart"
        @select-block="selectBlock"
      />
      <DropArea
        :blocks="blocks"
        :selected-block="selectedBlock"
        @drop="onDrop"
        @select-block="selectBlock"
        @delete-block="deleteBlock"
        @update-block-content="updateBlockContent"
        @update-block-column="updateBlockColumn"
      />
      <SettingsPanel
        :blocks="blocks"
        :selected-block="selectedBlock"
        @update-block-content="updateBlockContent"
        @update-block-image="updateBlockImage"
        @update-block-alt="updateBlockAlt"
        @update-block-color="updateBlockColor"
        @update-block-columns="updateBlockColumns"
        @delete-block="deleteBlock"
      />
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}
.editor-body {
  display: flex;
  flex: 1;
  height: calc(100vh - 80px - 60px);
  overflow: hidden;
}
</style>
