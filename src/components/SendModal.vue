<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal">
      <h3 class="modal-title">📤 Отправить письмо</h3>
      <p class="modal-subtitle">Введите email получателя, чтобы открыть почтовый клиент</p>

      <form @submit.prevent="sendEmail" class="send-form">
        <div class="form-group">
          <label class="form-label">Кому (email)</label>
          <input
            v-model="recipient"
            type="email"
            class="form-input"
            placeholder="example@mail.ru"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Тема письма</label>
          <input
            v-model="subject"
            type="text"
            class="form-input"
            placeholder="Тема письма"
            required
          />
        </div>
        <div class="form-actions">
          <button type="submit" class="send-submit">📤 Открыть в почтовом клиенте</button>
          <button type="button" class="cancel-btn" @click="close">Отмена</button>
        </div>
      </form>

      <div class="divider">или выберите провайдера вручную</div>

      <div class="provider-buttons">
        <button @click="openProvider('gmail')" class="provider-btn gmail">
          <span class="provider-icon">📧</span> Gmail
        </button>
        <button @click="openProvider('yandex')" class="provider-btn yandex">
          <span class="provider-icon">📧</span> Yandex
        </button>
        <button @click="openProvider('mailru')" class="provider-btn mailru">
          <span class="provider-icon">📧</span> Mail.ru
        </button>
      </div>

      <div class="modal-actions">
        <button @click="copyHTML" class="action-btn copy-btn">📋 Копировать HTML</button>
        <button @click="downloadHTML" class="action-btn download-btn">📥 Скачать HTML</button>
      </div>

      <div v-if="statusMessage" class="status-message" :class="statusType">
        {{ statusMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { generateHTML } from '../utils/emailGenerator'

const props = defineProps<{
  isOpen: boolean
  blocks: any[]
  projectName?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const recipient = ref('')
const subject = ref('')
const statusMessage = ref('')
const statusType = ref('')

// При открытии модального окна заполняем тему автоматически
watch(() => props.isOpen, (val) => {
  if (val) {
    subject.value = props.projectName ? `Макет: ${props.projectName}` : 'Email макет'
  }
})

const close = () => {
  emit('close')
  recipient.value = ''
  subject.value = ''
  statusMessage.value = ''
  statusType.value = ''
}

const sendEmail = () => {
  if (!recipient.value) {
    statusMessage.value = 'Введите email получателя'
    statusType.value = 'error'
    return
  }
  const domain = recipient.value.split('@')[1]?.toLowerCase()
  if (!domain) {
    statusMessage.value = 'Некорректный email'
    statusType.value = 'error'
    return
  }
  if (domain.includes('gmail.com') || domain.includes('googlemail.com')) {
    openProvider('gmail')
  } else if (domain.includes('mail.ru') || domain.includes('inbox.ru') || domain.includes('list.ru') || domain.includes('bk.ru')) {
    openProvider('mailru')
  } else if (domain.includes('yandex.ru') || domain.includes('ya.ru') || domain.includes('yandex.ua') || domain.includes('yandex.by') || domain.includes('yandex.kz')) {
    openProvider('yandex')
  } else {
    statusMessage.value = `Домен ${domain} не распознан. Выберите провайдера вручную ниже.`
    statusType.value = 'error'
  }
}

const openProvider = (provider: string) => {
  const subjectEncoded = encodeURIComponent(subject.value || 'Email макет')
  const plainText = generatePlainText()
  const bodyEncoded = encodeURIComponent(plainText)

  let url = ''
  switch (provider) {
    case 'gmail':
      url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient.value)}&su=${subjectEncoded}&body=${bodyEncoded}`
      break
    case 'yandex':
      url = `https://mail.yandex.ru/compose?to=${encodeURIComponent(recipient.value)}&subject=${subjectEncoded}&body=${bodyEncoded}`
      break
    case 'mailru':
      url = `https://e.mail.ru/compose?to=${encodeURIComponent(recipient.value)}&subject=${subjectEncoded}&body=${bodyEncoded}`
      break
    default: return
  }

  window.open(url, '_blank')
  close()
}

const generatePlainText = () => {
  const html = generateHTML(props.blocks)
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

const copyHTML = () => {
  const html = generateHTML(props.blocks)
  navigator.clipboard.writeText(html)
    .then(() => {
      statusMessage.value = 'HTML скопирован в буфер обмена!'
      statusType.value = 'success'
      setTimeout(() => { statusMessage.value = '' }, 3000)
    })
    .catch(() => {
      statusMessage.value = 'Не удалось скопировать'
      statusType.value = 'error'
    })
}

const downloadHTML = () => {
  const html = generateHTML(props.blocks)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `email-${Date.now()}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  max-width: 520px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  max-height: 90vh;
  overflow-y: auto;
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}
.modal-subtitle {
  color: #64748b;
  margin-bottom: 1.5rem;
}
.send-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}
.form-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}
.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
}
.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.send-submit {
  flex: 1;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.send-submit:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(79,70,229,0.3);
}
.cancel-btn {
  padding: 0.5rem 1.5rem;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}
.cancel-btn:hover {
  background: #e2e8f0;
}
.divider {
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 1rem 0;
}
.provider-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.provider-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  background: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.provider-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}
.provider-btn.gmail:hover { border-color: #ea4335; background: #fef2f2; }
.provider-btn.yandex:hover { border-color: #fc3f1d; background: #fff5f2; }
.provider-btn.mailru:hover { border-color: #005ff9; background: #f0f7ff; }
.provider-icon { font-size: 1.25rem; }

.modal-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
}
.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.copy-btn {
  background: #e2e8f0;
  color: #334155;
}
.copy-btn:hover { background: #cbd5e1; }
.download-btn {
  background: #4f46e5;
  color: white;
}
.download-btn:hover { background: #4338ca; }

.status-message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
}
.status-message.success {
  background: #d1fae5;
  color: #065f46;
}
.status-message.error {
  background: #fecaca;
  color: #991b1b;
}
</style>
