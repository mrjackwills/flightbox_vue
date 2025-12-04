<template>
	<v-toolbar
		id='toolbar'
		app
		color='grey-darken-3'
		dark
		flat
		:height='toolbarHeight'
	>
		<v-img class='ml-2' :eager='true' :max-width='logoWidth' src='@/assets/logo.svg' />

		<v-row align='center' class='pa-0 ma-0' justify='start' no-gutters>
			<v-col class='unselectable ml-2' cols='auto'>
				<span class='text-h4 white--text'>flightbox</span>

			</v-col>
		</v-row>

		<section v-if='authenticated && init'>
			<v-icon class='mr-4' color='white' :icon :size='mdAndUp ? `large` : `default`' />

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

const { mobile, mdAndUp } = useDisplay()

const [flightboxStatusStore, loadingStore, userStore] = [flightboxStatusModule(), loadingModule(), userModule()]

const authenticated = computed(() => userStore.authenticated)
const icon = computed(() => online.value ? mdiWifiArrowUpDown : mdiWifiStrengthAlertOutline)
const init = computed(() => flightboxStatusStore.init)
const loading = computed(() => loadingStore.loading)
const logoWidth = computed(() => mobile.value ? '40px' : '55px')
const online = computed(() => flightboxStatusStore.online)
const progressHeight = computed(() => mobile.value ? '8' : '4')
const toolbarHeight = computed(() => mobile.value ? '56' : '70')

</script>
