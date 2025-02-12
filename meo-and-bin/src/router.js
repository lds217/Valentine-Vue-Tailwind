import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Love from '@/components/Love.vue'

const routes = [
  { path: '/', component: Home },         // Landing page
  { path: '/love', component: Love }      // Love counter page (lowercase 'love')
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
