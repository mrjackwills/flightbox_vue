<template>
	<v-toolbar
		id='toolbar'
		app
		color='grey-darken-3'
		dark
		density='comfortable'
		flat
	>
		<v-img
			alt='the flightbox logo'
			class='ml-2'
			eager
			max-width='50px'

			src='@/assets/logo.svg'
		/>

		<v-row class='pa-0 ma-0 align-center justify-start ga-0'>
			<v-col class='unselectable ml-2' cols='auto'>
				<span class='text-headline-large white--text'>flightbox</span>
			</v-col>
		</v-row>

		<section v-if='authenticated && init'>
			<v-icon class='mr-4' color='white' :icon :size='iconSize' />

		</section>
		<v-progress-linear
			v-if='loading'
			absolute
			color='primary'
			:height='progressHeight'
			:indeterminate='loading'
			location='bottom center'
		/>
	</v-toolbar>

</template>

<script setup lang='ts'>

import { mdiWifiArrowUpDown, mdiWifiStrengthAlertOutline } from '@mdi/js'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const [flightboxStatusStore, loadingStore, userStore] = [flightboxStatusModule(), loadingModule(), userModule()]

// const client = computed(() => import.meta.client)

const authenticated = computed(() => userStore.authenticated)
// const density = computed(() => import.meta.client ? (mdAndUp.value ? 'default' : 'compact') : 'default')
const icon = computed(() => online.value ? mdiWifiArrowUpDown : mdiWifiStrengthAlertOutline)
const iconSize = computed(() => import.meta.client ? (mdAndUp.value ? 'large' : 'default') : 'large')
const init = computed(() => flightboxStatusStore.init)
const loading = computed(() => loadingStore.loading)
const online = computed(() => flightboxStatusStore.online)
const progressHeight = computed(() => import.meta.client ? (mdAndUp.value ? '4' : '8') : '4')

</script>
