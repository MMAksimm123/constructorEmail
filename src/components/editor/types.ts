export interface EmailBlock {
  id: string
  type: string
  content?: string
  src?: string
  alt?: string
  color?: string
  columns?: any[]
}

export interface ComponentItem {
  type: string
  name: string
  icon: string
}

export const COMPONENTS: ComponentItem[] = [
  { type: 'text', name: 'Текст', icon: '📝' },
  { type: 'heading', name: 'Заголовок', icon: '📰' },
  { type: 'image', name: 'Изображение', icon: '🖼️' },
  { type: 'button', name: 'Кнопка', icon: '🔘' },
  { type: 'divider', name: 'Разделитель', icon: '➖' },
  { type: 'columns', name: 'Колонки', icon: '📊' },
]
