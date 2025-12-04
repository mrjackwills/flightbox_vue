<template>
	<v-app id='flightbox' class='ma-0 pa-0'>
		<AppToolbar />

		<v-container class='ma-0 pa-0' :class='authenticated && init ? "" : "fill-height"' fluid>
			<v-main>
				<v-row align='center' class='ma-0 pa-0' justify='center'>
					<v-col
						class='ma-0 pa-0'
						cols='11'
						md='12'
						no-gutters
					>
						<router-view />
					</v-col>
				</v-row>
			</v-main>
		</v-container>

		<AppFooter />
		<AppDialog />
		<AppSnackbar />
	</v-app>
</template>

<script setup lang='ts'>

import { useHead } from '@vueuse/head'
import { registerSW } from 'virtual:pwa-register'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { snackSuccess } from '@/services/snack'

const { updateServiceWorker } = useRegisterSW()
if ('serviceWorker' in navigator) {
	registerSW({
		onNeedRefresh () {
			appUpdate()
		},
	})
}

function appUpdate (): void {
	snackSuccess({
		message: 'downloading updates',
		loading: true,
		timeout: 5000,
		icon: '',
	})
	window.setTimeout(() => updateServiceWorker(), 4500)
}

const [aircraftStore, userStore] = [aircraftModule(), userModule()]

const isHidden = ref(false)
const logoutTimeout = ref(0)

const authenticated = computed(() => userStore.authenticated)

const init = computed(() => aircraftModule().init)

useHead({
	title: () => {
		return authenticated.value && aircraftStore.init ? `flightbox - ${aircraftStore.number_current_flights} overhead` : `flightbox`
	},
	meta: [
		{
			name: `description`,
			content: `flightbox`,
		},
	],
	link: [
		{
			rel: 'canonical',
			href: `https://flights.mrjackwills.com`,
		},
	],
})

function logout (message = 'you have been logged out'): void {
	userStore.logout(message)
}

function visibilityChange (): void {
	isHidden.value = document.hidden
	if (isHidden.value) {
		logoutTimeout.value = window.setTimeout(() => {
			logout()
		}, 1000 * 60 * 7.5)
	} else {
		if (!userStore.authenticated) logout('')
		clearTimeout(logoutTimeout.value)
		logoutTimeout.value = 0
	}
}

onMounted(() => {
	document.addEventListener('visibilitychange', visibilityChange)
})

</script>

<style>
.tooltip {
	background: rgba(0, 0, 0, .75) !important;
}

#flightbox {
	background-color: #212121;
}
</style>
