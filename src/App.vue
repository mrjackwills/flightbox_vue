<template>
	<v-app class='ma-0 pa-0' id='flightbox'>
		<v-main>
			
			<v-container class='fill-height' fluid >
				<v-row
					class='fill-height'
					align='center'
					justify='center'
				>
					<v-col cols='11' no-gutters class='ma-0 pa-0'>
						<v-card transition='fade-transition' class='elevation-0 ma-0 pa-0 mb-3' color='grey-darken-4' id='main_card'>
							<AppToolbar />
							<v-card-text >
								<router-view  />
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		
		</v-main>
		<AppDialog />
		<AppSnackbar />
		<AppFooter />
	</v-app>
</template>

<script setup lang='ts'>

import { snackSuccess } from '@/services/snack';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { registerSW } from 'virtual:pwa-register';
import { useHead } from '@vueuse/head';

const { updateServiceWorker } = useRegisterSW();
if ('serviceWorker' in navigator) {
	registerSW({
		onNeedRefresh () {
			appUpdate();
		}
	});
}

const appUpdate = (): void => {
	snackSuccess({ message: 'downloading updates', loading: true, timeout: 5000, icon: '' });
	window.setTimeout(() => updateServiceWorker(), 4500);
};

const [ aircraftStore, userStore ] = [ aircraftModule(), userModule() ];

const isHidden = ref(false);
const logoutTimeout = ref(0);

useHead({
	title: () => {
		if (userStore.authenticated && aircraftStore.init) {
			return `flightbox - ${aircraftStore.number_current_flights} overhead`;
		} else {
			return `flightbox`;
		}
	},
	meta: [
		{
			name: `description`,
			content: `flightbox`,
		},
	],
	link: [ { rel: 'canonical', href: `https://flights.mrjackwills.com` } ],
});

const logout = (message = 'you have been logged out'): void => {
	userStore.logout(message);
};

const visibilityChange = (_e: Event): void => {
	isHidden.value = document.hidden;
	if (isHidden.value) {
		logoutTimeout.value = window.setTimeout(() => {
			logout();
		}, 1000 * 60 * 7.5);
	} else {
		if (!userStore.authenticated) logout('');
		clearTimeout(logoutTimeout.value);
		logoutTimeout.value = 0;
	}
};

onMounted(() => {
	document.addEventListener('visibilitychange', visibilityChange);
});

</script>

<style>

#main_card {
	border-radius: 1rem;
}

.tooltip {
	background: rgba(0,0,0,.75)!important;
}

</style>
