import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Love from '@/components/Love.vue'

const routes = [
  { path: '/', component: Home },   
  { path: '/love', component: Love }    
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
