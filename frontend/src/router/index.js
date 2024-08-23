import {createRouter, createWebHistory} from 'vue-router'

import HomeView from '../views/home.vue'
import ReadingPage from '../views/reading.vue'

const routes = [
	{ path: '/', component: HomeView },
	{ path: '/read/:id', component: ReadingPage }
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router