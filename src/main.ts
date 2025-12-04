/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { Router } from 'vue-router'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { createApp, markRaw } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

const head = createHead()
const app = createApp(App)

declare module 'pinia' {
	export interface Pinia { router: () => Router }
	export interface PiniaCustomProperties { router: Router }
}

const pinia = createPinia()
pinia.use(({ store }) => {
	store.router = markRaw(router)
})
pinia.router = (): Router => router

app
	.use(head)
	.use(router)
	.use(pinia)
	.use(vuetify)
	.mount('#flightbox_app')
