import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView/HomeView.vue'
import DocumentationView from '@/views/DocumentationView/DocumentationView.vue'
import NotFound from '@/layouts/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: DocumentationView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

export default router
