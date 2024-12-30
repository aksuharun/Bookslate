import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('../views/home.vue')
const ReadingPage = () => import('../views/reading.vue')

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView
	},
	{
		path: '/read/:id',
		name: 'reading',
		component: ReadingPage
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router