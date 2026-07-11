import { createRouter, createWebHistory } from 'vue-router'
import ProjectList from '../components/ProjectList.vue'
import EmailEditor from '../views/EmailEditor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ProjectList,
    },
    {
      path: '/editor/:name?',
      name: 'editor',
      component: EmailEditor,
      props: true,
    },
  ],
})

export default router
