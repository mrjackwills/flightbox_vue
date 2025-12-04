import { createRouter, createWebHistory } from 'vue-router'
import { FrontendRoutes } from '@/types'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: FrontendRoutes.BASE,
			name: 'home',
			component: HomeView,
			beforeEnter: (_to, _from, next): void => {
				const user_store = userModule()
				if (user_store.authenticated) {
					next()
				} else {
					next(FrontendRoutes.LOGIN)
				}
			},
		},
		{
			path: FrontendRoutes.LOGIN,
			name: 'login',
			component: LoginView,
			beforeEnter: (_to, _from, next): void => {
				const user_store = userModule()
				const isAuthenticated = user_store.authenticated
				if (isAuthenticated) {
					next(FrontendRoutes.BASE)
				} else {
					next()
				}
			},
		},
		{
			path: FrontendRoutes.CATCHALL,
			name: 'not-found',
			redirect: { name: 'home' },
		},
	],
})

export default router
