<template>
	<v-toolbar
		:height='toolbarHeight'
		color='grey-darken-3'
		id='toolbar'
		app
		dark
		flat
	>
		<v-img src='@/assets/logo.svg' :eager='true' :max-width='logoWidth' class='ml-2' />

		<v-row align='center' justify='start' no-gutters class='pa-0 ma-0'>
			<v-col cols='auto' class='unselectable ml-2' >
				<span class='text-h4 white--text'>flightbox</span>
				
			</v-col>
		</v-row>

		<section v-if='authenticated && init'>
			<span v-if='overhead > 0' class='mr-4'>{{ overhead }} overhead</span>

			<v-icon
				color='white'
				class='mr-4'
				:icon='icon'
				:size='mdAndUp?`large`:`default`'
			/>
	
		</section>
		<v-progress-linear
			v-if='loading'
			:indeterminate='loading'
			:height='progressHeight'
			location='bottom center'
			color='primary'
			absolute
		/>
	</v-toolbar>

</template>

<script setup lang='ts'>

import { mdiWifiArrowUpDown, mdiWifiStrengthAlertOutline } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mobile, mdAndUp } = useDisplay();

const [ flightboxStatusStore, loadingStore, userStore ] = [ flightboxStatusModule(), loadingModule(), userModule() ];

const progressHeight = computed(() => {
	return mobile.value ? '8' : '4';
});

const overhead = computed(() =>{
	return aircraftModule().number_current_flights;
});

const authenticated = computed(() => {
	return userStore.authenticated;
});
const icon = computed(() => {
	return online.value ? mdiWifiArrowUpDown : mdiWifiStrengthAlertOutline ;
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
