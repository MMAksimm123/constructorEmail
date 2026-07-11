<template>
  <div
    class="email-block"
    :class="{ 'block-selected': selected }"
    @click="selectBlock"
  >
    <!-- Текстовый блок с inline-редактированием -->
    <div v-if="block.type === 'text'" class="block-text">
      <p
        ref="contentRef"
        contenteditable="true"
        @input="updateContent"
        @keydown.enter.prevent
        @blur="onBlur"
        @focus="onFocus"
        class="editable-text"
        :class="{ 'editing': isEditing }"
      >
        {{ block.content || 'Текст' }}
      </p>
    </div>

    <!-- Блок заголовка с inline-редактированием -->
    <div v-else-if="block.type === 'heading'" class="block-heading">
      <h2
        ref="contentRef"
        contenteditable="true"
        @input="updateContent"
        @blur="onBlur"
        @focus="onFocus"
        class="editable-heading"
        :class="{ 'editing': isEditing }"
      >
        {{ block.content || 'Заголовок' }}
      </h2>
    </div>

    <!-- Блок изображения -->
    <div v-else-if="block.type === 'image'" class="block-image">
      <div v-if="block.src" class="image-wrapper">
        <img :src="block.src" :alt="block.alt || 'Изображение'" />
      </div>
      <div v-else class="image-placeholder">
        <span>🖼️</span>
        <p>Изображение</p>
        <small class="image-hint">Добавьте URL в настройках</small>
      </div>
    </div>

    <!-- Блок кнопки с inline-редактированием -->
    <div v-else-if="block.type === 'button'" class="block-button">
      <a
        ref="contentRef"
        href="#"
        contenteditable="true"
        @input="updateContent"
        @blur="onBlur"
        @focus="onFocus"
        class="email-button"
        :style="{ backgroundColor: block.color || '#4f46e5' }"
        :class="{ 'editing': isEditing }"
        @click.prevent
      >
        {{ block.content || 'Кнопка' }}
      </a>
    </div>

    <!-- Блок разделителя -->
    <div v-else-if="block.type === 'divider'" class="block-divider">
      <hr />
    </div>

    <!-- Блок с колонками -->
    <div v-else-if="block.type === 'columns'" class="block-columns">
      <div class="columns-container">
        <div
          v-for="(col, colIndex) in block.columns"
          :key="colIndex"
          class="column"
          :class="{ 'column-editing': editingColumn === colIndex }"
          @click.stop="startColumnEditing(colIndex)"
        >
          <p
            :ref="(el: any) => setColumnRef(el, colIndex)"
            contenteditable="true"
            @input="(event: Event) => updateColumnContent(colIndex, event)"
            @blur="stopColumnEditing"
            @focus="() => onColumnFocus(colIndex)"
            class="editable-column"
            :class="{ 'editing': editingColumn === colIndex }"
          >
            {{ col.content || `Колонка ${colIndex + 1}` }}
          </p>
        </div>
      </div>
    </div>

    <!-- Кнопка удаления блока -->
    <button
      class="block-delete"
      @click.stop="deleteBlock"
      title="Удалить блок"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import type { EmailBlock } from './types'

// ===== ПРОПСЫ =====
const props = defineProps<{
  block: EmailBlock
  selected: boolean
}>()

// ===== ЭМИТЫ =====
const emit = defineEmits<{
  (e: 'select'): void
  (e: 'delete'): void
  (e: 'updateContent', content: string): void
  (e: 'updateColumn', payload: { columnIndex: number; content: string }): void
}>()

// ===== REFS =====
const contentRef = ref<HTMLElement | null>(null)
const isEditing = ref(false)

// ===== КОЛОНКИ =====
const editingColumn = ref<number | null>(null)
const columnRefs = ref<Map<number, HTMLElement>>(new Map())

// ===== СОХРАНЕНИЕ ПОЗИЦИИ КУРСОРА =====
const saveCursorPosition = (element: HTMLElement) => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null

  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(element)
  preCaretRange.setEnd(range.startContainer, range.startOffset)

  // Вычисляем позицию курсора от начала текста
  const start = preCaretRange.toString().length
  const end = start + range.toString().length

  return { start, end }
}

const restoreCursorPosition = (element: HTMLElement, position: { start: number; end: number } | null) => {
  if (!position || !element) return

  const selection = window.getSelection()
  if (!selection) return

  try {
    // Находим текстовые узлы
    const textNodes: Node[] = []
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    )

    let node = walker.nextNode()
    while (node) {
      if (node.textContent && node.textContent.length > 0) {
        textNodes.push(node)
      }
      node = walker.nextNode()
    }

    if (textNodes.length === 0) return

    // Ищем узел для начала и конца выделения
    let charCount = 0
    let startNode: Node | null = null
    let startOffset = 0
    let endNode: Node | null = null
    let endOffset = 0

    for (const textNode of textNodes) {
      const textLength = textNode.textContent?.length || 0

      if (!startNode && charCount + textLength >= position.start) {
        startNode = textNode
        startOffset = Math.min(position.start - charCount, textLength)
      }

      if (!endNode && charCount + textLength >= position.end) {
        endNode = textNode
        endOffset = Math.min(position.end - charCount, textLength)
        break
      }

      charCount += textLength
    }

    if (startNode && endNode) {
      const range = document.createRange()
      range.setStart(startNode, Math.min(startOffset, startNode.textContent?.length || 0))
      range.setEnd(endNode, Math.min(endOffset, endNode.textContent?.length || 0))

      selection.removeAllRanges()
      selection.addRange(range)
    }
  } catch (error) {
    // Если не удалось восстановить позицию, просто ставим курсор в конец
    const range = document.createRange()
    range.selectNodeContents(element)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

// ===== МЕТОДЫ БЛОКА =====
const selectBlock = () => {
  emit('select')
}

const deleteBlock = () => {
  emit('delete')
}

const onFocus = () => {
  isEditing.value = true
}

const updateContent = (event: Event) => {
  const target = event.target as HTMLElement
  const position = saveCursorPosition(target)
  const newContent = target.innerText || ''

  // Обновляем содержимое
  emit('updateContent', newContent)

  // Восстанавливаем позицию курсора после обновления DOM
  nextTick(() => {
    if (contentRef.value) {
      restoreCursorPosition(contentRef.value, position)
    }
  })
}

const onBlur = () => {
  isEditing.value = false
}

// ===== МЕТОДЫ КОЛОНОК =====
const setColumnRef = (el: any, index: number) => {
  if (el && el instanceof HTMLElement) {
    columnRefs.value.set(index, el)
  } else if (el && el.$el && el.$el instanceof HTMLElement) {
    columnRefs.value.set(index, el.$el)
  } else {
    columnRefs.value.delete(index)
  }
}

const onColumnFocus = (index: number) => {
  editingColumn.value = index
}

const startColumnEditing = (index: number) => {
  editingColumn.value = index
  nextTick(() => {
    const ref = columnRefs.value.get(index)
    if (ref) {
      ref.focus()
      // Помещаем курсор в конец текста
      const range = document.createRange()
      range.setStart(ref.firstChild || ref, ref.textContent?.length || 0)
      range.collapse(false)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  })
}

const updateColumnContent = (index: number, event: Event) => {
  const target = event.target as HTMLElement
  const position = saveCursorPosition(target)
  const newContent = target.innerText || ''

  emit('updateColumn', { columnIndex: index, content: newContent })

  nextTick(() => {
    const ref = columnRefs.value.get(index)
    if (ref) {
      restoreCursorPosition(ref, position)
    }
  })
}

const stopColumnEditing = () => {
  editingColumn.value = null
}

// ===== АВТО-ФОКУС ПРИ ВЫБОРЕ =====
const shouldAutoFocus = ['text', 'heading', 'button'].includes(props.block.type)

const focusContent = () => {
  if (contentRef.value && props.selected) {
    nextTick(() => {
      if (contentRef.value) {
        contentRef.value.focus()
        // Помещаем курсор в конец текста
        const range = document.createRange()
        const textNode = contentRef.value.firstChild
        if (textNode) {
          range.setStart(textNode, textNode.textContent?.length || 0)
        } else {
          range.setStart(contentRef.value, 0)
        }
        range.collapse(false)
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    })
  }
}

// Следим за изменением selected
watch(
  () => props.selected,
  (newVal) => {
    if (newVal && shouldAutoFocus) {
      focusContent()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.email-block {
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.email-block:hover {
  border-color: #cbd5e1;
  background: #fafbfc;
}

.email-block.block-selected {
  border-color: #4f46e5;
  background: #f8fafc;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.block-delete {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.email-block:hover .block-delete {
  opacity: 1;
}

.block-delete:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* ===== ТЕКСТОВЫЙ БЛОК ===== */
.block-text p {
  margin: 0;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.6;
}

.editable-text {
  outline: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background 0.2s;
}

.editable-text.editing {
  background: rgba(79, 70, 229, 0.05);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

/* ===== ЗАГОЛОВОК ===== */
.block-heading h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.editable-heading {
  outline: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background 0.2s;
}

.editable-heading.editing {
  background: rgba(79, 70, 229, 0.05);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

/* ===== ИЗОБРАЖЕНИЕ ===== */
.block-image img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  display: block;
}

.image-placeholder {
  background: #f1f5f9;
  padding: 3rem;
  text-align: center;
  border-radius: 0.5rem;
  border: 2px dashed #e2e8f0;
}

.image-placeholder span {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.image-placeholder p {
  margin: 0;
  color: #94a3b8;
}

.image-hint {
  display: block;
  margin-top: 0.5rem;
  color: #cbd5e1;
  font-size: 0.75rem;
}

/* ===== КНОПКА ===== */
.block-button .email-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: opacity 0.2s;
  outline: none;
}

.block-button .email-button.editing {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
}

.block-button .email-button:hover {
  opacity: 0.9;
}

/* ===== РАЗДЕЛИТЕЛЬ ===== */
.block-divider hr {
  border: none;
  border-top: 2px solid #e2e8f0;
  margin: 0.5rem 0;
}

/* ===== КОЛОНКИ ===== */
.block-columns .columns-container {
  display: flex;
  gap: 1rem;
}

.column {
  flex: 1;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px dashed #e2e8f0;
  transition: all 0.2s;
  cursor: pointer;
}

.column:hover {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.column.column-editing {
  border-color: #4f46e5;
  background: #eef2ff;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.column p {
  margin: 0;
  color: #475569;
  outline: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.editable-column {
  outline: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background 0.2s;
}

.editable-column.editing {
  background: rgba(79, 70, 229, 0.05);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}
</style>
