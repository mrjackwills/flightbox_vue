<template>
	<v-toolbar :height='toolbarHeight' color='grey-darken-3' id='toolbar' app dark flat>
		<v-img src='@/assets/logo.svg' :eager='true' :max-width='logoWidth' class='ml-2' />

		<v-row align='center' justify='start' no-gutters class='pa-0 ma-0'>
			<v-col cols='auto' class='unselectable ml-2'>
				<span class='text-h4 white--text'>flightbox</span>

			</v-col>
		</v-row>

		<section v-if='authenticated && init'>
			<v-icon color='white' class='mr-4' :icon='icon' :size='mdAndUp ? `large` : `default`' />

		</section>
		<v-progress-linear v-if='loading' :indeterminate='loading' :height='progressHeight' location='bottom center'
			color='primary' absolute />
	</v-toolbar>

</template>

<script setup lang='ts'>

import { mdiWifiArrowUpDown, mdiWifiStrengthAlertOutline } from '@mdi/js';
import { useDisplay } from 'vuetify';

const { mobile, mdAndUp } = useDisplay();

const [flightboxStatusStore, loadingStore, userStore] = [flightboxStatusModule(), loadingModule(), userModule()];

const authenticated = computed(() => userStore.authenticated);
const icon = computed(() => online.value ? mdiWifiArrowUpDown : mdiWifiStrengthAlertOutline);
const init = computed(() => flightboxStatusStore.init);
const loading = computed(() => loadingStore.loading);
const logoWidth = computed(() => mobile.value ? '40px' : '55px');
const online = computed(() => flightboxStatusStore.online);
const progressHeight = computed(() => mobile.value ? '8' : '4');
const toolbarHeight = computed(() => mobile.value ? '56' : '70');

</script>
