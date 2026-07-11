<script setup lang="ts">
import { ref } from 'vue'
import ProjectList from './components/ProjectList.vue'

const projectsCount = ref(0)
</script>

<template>
  <div class="app-container">
    <header v-if="$route.path === '/'" class="header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">✉️</div>
          <div>
            <h1 class="logo-title">Конструктор Email</h1>
            <p class="logo-subtitle">Управляйте своими проектами</p>
          </div>
        </div>
        <div class="header-right">
          <router-link to="/editor" class="create-btn">
            <span class="create-icon">➕</span>
            Создать макет
          </router-link>
        </div>
      </div>
    </header>

    <!-- Шапка для редактора -->
    <header v-else class="header editor-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">✉️</div>
          <div>
            <h1 class="logo-title">Конструктор Email</h1>
            <p class="logo-subtitle">Редактор</p>
          </div>
        </div>
        <div class="header-right">
          <router-link to="/" class="back-btn">
            <span class="back-icon">←</span>
            На главную
          </router-link>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="main-content">
      <router-view @update:count="projectsCount = $event" />
    </main>

    <!-- Футер главной страницb -->
    <footer v-if="$route.path === '/'" class="footer">
      <div class="footer-content">
        <span>© {{ new Date().getFullYear() }} Конструктор Email</span>
        <span class="footer-status">
          <span class="status-dot"></span>
          Все данные хранятся локально
        </span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #eef2ff 100%);
}

.header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(203, 213, 225, 0.3);
  padding: 1.5rem 2rem;
}

@media (min-width: 640px) {
  .header {
    padding: 1.5rem 3rem;
  }
}

@media (min-width: 1024px) {
  .header {
    padding: 1.5rem 4rem;
  }
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
}

.logo-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.025em;
}

@media (min-width: 640px) {
  .logo-title {
    font-size: 1.875rem;
  }
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.025em;
  margin-top: 0.125rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
  white-space: nowrap;
}

.create-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35);
}

.create-btn:active {
  transform: scale(0.95);
}

.create-icon {
  font-size: 1.125rem;
  line-height: 1;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: rgba(241, 245, 249, 0.8);
  color: #475569;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(203, 213, 225, 0.3);
  white-space: nowrap;
}

.back-btn:hover {
  background: rgba(226, 232, 240, 0.8);
  transform: scale(1.02);
}

.back-icon {
  font-size: 1.125rem;
  line-height: 1;
}

.projects-counter {
  background: linear-gradient(135deg, #eef2ff, #ede9fe);
  padding: 0.5rem 1.25rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid rgba(165, 180, 252, 0.3);
}

.counter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.counter-value {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.version-badge {
  font-size: 0.75rem;
  color: #94a3b8;
  background: rgba(241, 245, 249, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(203, 213, 225, 0.3);
  display: none;
}

@media (min-width: 640px) {
  .version-badge {
    display: block;
  }
}

.main-content {
  flex: 1;
  padding: 0;
}


.footer {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(203, 213, 225, 0.3);
  padding: 1.5rem 2rem;
}

@media (min-width: 640px) {
  .footer {
    padding: 1.5rem 3rem;
  }
}

@media (min-width: 1024px) {
  .footer {
    padding: 1.5rem 4rem;
  }
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

@media (min-width: 640px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

@media (max-width: 640px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .logo-section {
    justify-content: center;
  }

  .header-right {
    justify-content: center;
  }

  .create-btn,
  .back-btn {
    width: 100%;
    justify-content: center;
  }

  .projects-counter {
    padding: 0.375rem 1rem;
  }

  .counter-value {
    font-size: 1.25rem;
  }
}
</style>
