<template>
	<section>
		<v-toolbar
			:height='toolbarHeight'
			id='toolbar'
			dark
			color='primary'
			flat
		>
			<v-img src='@/assets/logo.svg' :eager='true' :max-width='logoWidth' class='ml-2' />

			<v-row align='center' justify='start' no-gutters class='pa-0 ma-0'>
				<v-col cols='auto' class='unselectable ml-2' >
					<span class='text-h4 white--text'>flightbox</span>
				</v-col>
			</v-row>

			<section v-if='authenticated && init'>

				<v-icon
					color='white'
					class='mr-4'
					:icon='icon'
					:size='mdAndUp?`large`:`default`'
				/>
	
			</section>
		</v-toolbar>

		<v-progress-linear
			:height='progressHeight'
			:indeterminate='loading'
			color='offwhite'
			bg-opacity='1'
			bg-color='primary'
			bottom
			absolute
		/>

	</section>
</template>

<script setup lang='ts'>

import { mdiWifiArrowUpDown, mdiWifiStrengthAlertOutline } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mobile, mdAndUp } = useDisplay();

const [ flightboxStatusStore, loadingStore, userStore ] = [ flightboxStatusModule(), loadingModule(), userModule() ];

const progressHeight = computed(() => {
	return mobile.value ? '8' : '4';
});

const authenticated = computed(() => {
	return userStore.authenticated;
});
const icon = computed(() => {
	return online ? mdiWifiArrowUpDown : mdiWifiStrengthAlertOutline ;
});
const init = computed(() => {
	return flightboxStatusStore.init;
});
const loading = computed(() => {
	return loadingStore.loading;
});
const logoWidth = computed(() => {
	return mobile.value ? '40px' : '55px';
});
const online = computed(() => {
	return flightboxStatusStore.online;
});
const toolbarHeight = computed(() => {
	return mobile.value ? '56' : '70';
});

</script>

<style scoped>
#toolbar {
	border-radius: 1rem 1rem 0 0;
}
</style>