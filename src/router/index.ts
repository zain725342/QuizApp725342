import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateQuiz from '../views/CreateQuiz.vue'
import TakeQuiz from '../views/TakeQuiz.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/create',
      name: 'create',
      component: CreateQuiz
    },
    {
      path: '/take/:key',
      name: 'take',
      component: TakeQuiz
    },
    
  ]
})

export default router
